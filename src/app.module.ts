import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { QuestionModule } from './question/question.module';
import { AnswerModule } from './answer/answer.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ScheduleModule } from '@nestjs/schedule';
import { AzureStorageModule } from './azure-storage/azure-storage.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot({}),
    UsersModule,
    QuestionModule,
    AnswerModule,
    PrismaModule,
    AuthModule,
    AzureStorageModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
