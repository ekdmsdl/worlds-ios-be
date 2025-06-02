import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { Multer } from 'multer';



@Injectable()
export class QuestionService {
  constructor(private prisma: PrismaService) {}

  async createQuestion(
    userId: number,
    createquestionDto: CreateQuestionDto,
    files: Express.Multer.File[],
  ) {
    const question = await this.prisma.question.create({
      data: {
        ...createquestionDto,
        userId,
      },
    });

    if (files && files.length > 0) {
      const attachmentPromise = files.map(async (file) => {
        return this.prisma.attachment.create({
          data: {
            questionId: question.id,
            fileName: file.originalname,
            fileUrl: file['url'],
            fileSize: file.size,
            fileType: file.mimetype,
          },
        });
      });
      await Promise.all(attachmentPromise);
    }
    return this.prisma.question.findUnique({
      where: { id: question.id },
      include: {
        user: true,
        attachment: true,
      },
    });
  }

  // 전체 게시글 조회
  async getQuestion() {
    return this.prisma.question.findMany({
      include: { user: true, answers: true },
      orderBy: { id: 'desc' },
    });
  }

  // 단일 게시글 조회
  async getQuestionById(id: number) {
    return this.prisma.question.findUnique({
      where: { id },
      include: { user: true, answers: true },
    });
  }
}

  // 게시글 수정
//   async updateQuestion(id: number, userId: number, dto: UpdateQuestionDto) {
//     const question = await this.prisma.question.findUnique({ where: { id } });
//     if (!question || question.userId !== userId)
//       throw new Error('권한 없음 또는 게시글 없음');
//     return this.prisma.question.update({ where: { id }, data: dto });
//   }

  // 게시글 삭제
//   async deleteQuestion(id: number, userId: number) {
//     const question = await this.prisma.question.findUnique({ where: { id } });
//     if (!question || question.userId !== userId)
//       throw new Error('권한 없음 또는 게시글 없음');
//     return this.prisma.question.delete({ where: { id } });
//   }


