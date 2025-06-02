import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    console.log('JwtStrategy constructor called', process.env.JWT_SECRET);
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET environment variable is not defined');
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  // 토큰이 유효하면 실행
  async validate(payload: any) { // payload : auth.service.ts의 login 메서드에서 생성한 JWT 토큰의 페이로드
    return { //payload의 내용을 반환
      id: payload.sub, 
      email: payload.email,
      name: payload.name,
      role: payload.role,
    };
  }
}
