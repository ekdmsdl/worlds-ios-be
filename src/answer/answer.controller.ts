import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Request,
  BadRequestException,
} from '@nestjs/common';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AnswerService } from './answer.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';

@Controller('answer')
@ApiTags('answer')
@ApiBearerAuth()
export class AnswerController {
  constructor(private readonly answerService: AnswerService) {}

  //답변작성
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('question/:id/answer')
  @ApiOperation({ summary: '답변 작성' })
  async createAnswer(
    @Request() req,
    @Param('id') questionId: string,
    @Body() dto: CreateAnswerDto,
  ) {
    if (req.user.role !== '멘토') {
      throw new BadRequestException('멘토만 답변 작성이 가능합니다.');
    }
    return this.answerService.createAnswer(
      req.user.id,
      Number(questionId),
      dto,
    );
  }

  // 게시글별 답변 조회
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('question/:id/answer')
  @ApiOperation({ summary: '게시글별 답변 조회' })
  async getAnswersByQuestion(@Param('id') questionId: number) {
    const questionIdNum = Number(questionId); // <-- 이거 빠지면 Prisma에서 에러남
    if (isNaN(questionIdNum)) {
      throw new BadRequestException('Invalid question id');
    }
    return this.answerService.getAnswersByQuestion(questionIdNum);
  }

  // 멘토별 답변 수 조회
  @UseGuards(JwtAuthGuard)
  @Get('/ranking/mentors')
  @ApiOperation({ summary: '멘토별 답변 수 랭킹' })
  async getMentorRankings() {
    return this.answerService.getMentorRankings();
  }

  // 자기 답변 조회
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('/my/answers')
  @ApiOperation({ summary: '내가 작성한 답변 목록(멘토)' })
  async getMyAnswers(@Request() req) {
    if( req.user.role !== '멘토') {
      throw new BadRequestException('멘토만 자신의 답변을 조회할 수 있습니다.');
    }
    return this.answerService.getMyAnswers(req.user.id);
  }


}
