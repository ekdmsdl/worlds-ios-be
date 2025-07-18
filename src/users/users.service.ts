import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const hashedPassword: string = await (bcrypt as any).hash(
      createUserDto.password,
      10,
    );
    return this.prisma.user.create({
      data: {
        email: createUserDto.email,
        name: createUserDto.name,
        password: hashedPassword,
        role: createUserDto.role,
      },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findById(id: number) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  //비밀번호 재설정
  async changePassword(id: number, changePasswordDto: ChangePasswordDto) {
    const hashedPassword: string = await (bcrypt as any).hash(
      changePasswordDto.newpassword,
      10,
    );
    return this.prisma.user.update({
      where: { id: id },
      data: { password: hashedPassword },
    });
  }
}
