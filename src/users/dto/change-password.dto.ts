//비밀번호 변경 시
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Min, MinLength } from "class-validator";

export class ChangePasswordDto {
    @IsNotEmpty()
    @MinLength(6)
    @ApiProperty({ description: '새로운 비밀번호', example: 'newpassword' })
    newpassword: string;
}

    

