//회원가입 시
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @ApiProperty({ description: '이메일', example: 'test@example.com' })
  email: string;

  @MinLength(6)
  @ApiProperty({ description: '비밀번호', example: 'password' })
  password: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '역할', example: 'mentor | mentee' })
  role: string;

  @IsNotEmpty()
  @ApiProperty({ description: '이름', example: 'test' })
  name: string;

}
