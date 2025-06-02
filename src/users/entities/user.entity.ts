import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';
import { Exclude } from 'class-transformer';

export class UserEntity {
  id: number;
  email: string;
  name: string;
  @Exclude()
  password: string;
  createdAt?: Date;
  @Exclude()
  updatedAt?: Date;
  role: string;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
