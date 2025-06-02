// 로그인시
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, Min, MinLength } from 'class-validator';

export class LoginUserDto {
  @IsEmail()
  @ApiProperty({ description: '이메일', example: 'test@example.com' })
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  @ApiProperty({ description: '비밀번호', example: 'password' })
  password: string;
}
