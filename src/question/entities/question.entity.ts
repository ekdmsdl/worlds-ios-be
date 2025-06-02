import { UserEntity } from 'src/users/entities/user.entity';
import { AnswerEntity } from 'src/answer/entities/answer.entitiy';
import { AttachmentEntity } from 'src/question/entities/attachment.entitiy';


export class QuestionEntity {
  id: number;
  title: string;
  content: string;
  userId?: number;
  user: UserEntity;
  answers?: AnswerEntity[];
  attachments?: AttachmentEntity[];

  constructor(partial: Partial<QuestionEntity>) {
    Object.assign(this, partial);
    if (partial.user) {
      this.user = new UserEntity(partial.user);
    }
    if (partial.answers) {
      this.answers = partial.answers.map((answer) => new AnswerEntity(answer));
    }
    if (partial.attachments) {
      this.attachments = partial.attachments.map(
        (attachment) => new AttachmentEntity(attachment),
      );
    }
  }
}
