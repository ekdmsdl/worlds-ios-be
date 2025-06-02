import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAnswerDto } from './dto/create-answer.dto';



@Injectable()
export class AnswerService {
  constructor(private prisma: PrismaService) {}

  // 답변 생성
  async createAnswer(userId: number, questionId: number, dto: CreateAnswerDto) {
    return this.prisma.answer.create({
      data: {
        ...dto,
        userId,
        questionId,
      },
    });
  }

  // 게시글별 답변 조회
  async getAnswersByQuestion(questionId: number) {
    return this.prisma.answer.findMany({
      where: { questionId },
      include: { user: true },
      orderBy: { id: 'asc' },
    });
  }

//   // 답변 수정
//   async updateAnswer(id: number, userId: number, dto: UpdateAnswerDto) {
//     const answer = await this.prisma.answer.findUnique({ where: { id } });
//     if (!answer || answer.userId !== userId)
//       throw new Error('권한 없음 또는 답변 없음');
//     return this.prisma.answer.update({ where: { id }, data: dto });
//   }

//   // 답변 삭제
//   async deleteAnswer(id: number, userId: number) {
//     const answer = await this.prisma.answer.findUnique({ where: { id } });
//     if (!answer || answer.userId !== userId)
//       throw new Error('권한 없음 또는 답변 없음');
//     return this.prisma.answer.delete({ where: { id } });
//   }
}