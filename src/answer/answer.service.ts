import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { count } from 'console';

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
      include: {
        user: true, // 답변 작성자 정보 포함 <-- 추가부분!!!!
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

  // 멘토별 답변 수 조회
  async getMentorRankings() {
    const mentors = await this.prisma.user.findMany({
      where: { role: '멘토' },
      select: {
        id: true,
        name: true,
        answer: true,
      },
    });

    return mentors
      .map((mentor) => ({
        name: mentor.name,
        count: mentor.answer.length,
      }))
      .sort((a, b) => b.count - a.count);
  }

  // 자기 답변 조회
  async getMyAnswers(userId: number) {
    return this.prisma.answer.findMany({
      where: { userId },
      include: { 
        question: true,
        user: true, // 답변 작성자 정보 포함
       },
      orderBy: { createdAt: 'desc' },
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
