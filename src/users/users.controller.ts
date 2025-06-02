import { Body, Controller, Patch, RawBody, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth() // Swagger에서 Bearer Token 인증을 사용하기 위한 설정!!! <<이게없어서 비번재설정이 안됏음
  @Patch('changepassword')
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
     //dto만 넘기면 누가 비밀번호 바꾸는지 몰라서 userId를 넘겨야 함
    @Req() req: Request & { user?: any },
  ) {
    const userId = req.user?.id; // JWT에서 유저 ID 추출
    // return this.usersService.changePassword(changePasswordDto); 
    // 위에는 userId 안 넘김
    return this.usersService.changePassword(userId, changePasswordDto);
  }
  }









