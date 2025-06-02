import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @ApiProperty({ description: '이메일', example: 'test@example.com' })
  email: string;

  @IsNotEmpty()
  @ApiProperty({ description: '이름', example: 'test' })
  name: string;

  @MinLength(6)
  @ApiProperty({ description: '비밀번호', example: 'password' })
  password: string;

  @IsNotEmpty()
  @ApiProperty({ description: '역할', example: '멘토' })
  role: string;
}
