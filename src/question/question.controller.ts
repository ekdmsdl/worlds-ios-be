import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { QuestionService } from './question.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateAnswerDto } from 'src/answer/dto/create-answer.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { QuestionEntity } from './entities/question.entity';
import { AzureStorageInterceptor } from '../azure-storage/azure-storage.interceptor';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('question')
@ApiTags('question')
@ApiBearerAuth()
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @UseGuards(JwtAuthGuard)
  @Post('question')
  @UseInterceptors(
    FilesInterceptor('files', 5, {
      limits: {
        fileSize: 1024 * 1024 * 5, // 5MB
      },
      fileFilter: (req, file, cb) => {
        const allowedType = [
          'image/jpeg',
          'image/png',
          'image/gif',
          'application/pdf',
        ];
        if (allowedType.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new BadRequestException('Invalid file type'), false);
        }
      },
    }),
    AzureStorageInterceptor,
  )
  @ApiOperation({ summary: '게시글 생성' })
  @ApiBearerAuth()
  async createQuestion(@Request() req, @Body() dto: CreateQuestionDto) {
    if (req.user.role !== '멘티') {
      throw new BadRequestException('멘티만 질문 작성이 가능합니다.');
    }
    const question = await this.questionService.createQuestion(
      req.user.id,
      dto,
      req.files,
    );
    return new QuestionEntity(question || {});
  }

  // 전체 게시글 조회
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('question')
  @ApiOperation({ summary: '전체 게시글 조회' })
  async getQuestion() {
    const question = await this.questionService.getQuestion();
    return question.map((question) => new QuestionEntity(question));
  }

  // 단일 게시글 조회
  @ApiBearerAuth()
  @Get('question/:id')
  @ApiOperation({ summary: '단일 게시글 조회' })
  async getQuestionById(@Param('id') id: string) {
    const question = await this.questionService.getQuestionById(Number(id));
    return new QuestionEntity(question || {});
  }

  // 내가 쓴 게시물 조회
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('/my/questions')
  @ApiOperation({ summary: '내가 작성한 질문 목록(멘티)' })
  async getMyQuestions(@Request() req) {
    if (req.user.role !== '멘티') {
      throw new BadRequestException('멘티만 자신의 질문을 조회할 수 있습니다.');
    }
    const questions = await this.questionService.getMyQuestions(req.user.id);
    return questions.map((question) => new QuestionEntity(question));
  }
}



// 게시글 수정
//   @UseGuards(JwtAuthGuard)
//   @Patch('question/:id')
//   @ApiOperation({ summary: '게시글 수정' })
//   async updateQuestion(
//     @Request() req,
//     @Param('id') id: string,
//     @Body() dto: UpdateQuestionDto,
//   ) {
//     const question = await this.questionService.updateQuestion(
//       Number(id),
//       req.user.id,
//       dto,
//     );
//     return new QuestionEntity(question || {});
//   }

// 게시글 삭제
//   @UseGuards(JwtAuthGuard)
//   @Delete('question/:id')
//   @ApiOperation({ summary: '게시글 삭제' })
//   async deleteQuestion(@Request() req, @Param('id') id: string) {
//     return this.questionService.deleteQuestion(Number(id), req.user.id);
//   }
