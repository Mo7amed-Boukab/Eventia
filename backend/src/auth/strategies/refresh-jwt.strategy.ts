import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: (req: Request) => {
        return req?.cookies?.refresh_token || null;
      },
      secretOrKey:
        configService.get<string>('JWT_REFRESH_SECRET') ||
        'default-refresh-secret',
      passReqToCallback: true,
    } as any);
  }

  async validate(req: Request, payload: any) {
    const refreshToken = req?.cookies?.refresh_token;

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token manquant');
    }

    return {
      userId: payload.sub,
      email: payload.email,
      role: payload.role,
      refreshToken,
    };
  }
}
