import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
  Res,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import * as express from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RefreshJwtAuthGuard } from './guards/refresh-jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  async register(
    @Body() registerDto: RegisterDto,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    const result = await this.authService.register(registerDto);
    this.setAuthCookies(res, result.access_token, result.refresh_token);
    return { user: result.user };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    const result = await this.authService.login(loginDto);
    this.setAuthCookies(res, result.access_token, result.refresh_token);
    return { user: result.user };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RefreshJwtAuthGuard)
  async refresh(
    @Request() req,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    const tokens = await this.authService.refreshTokens(
      req.user.userId,
      req.user.refreshToken,
    );
    this.setAuthCookies(res, tokens.access_token, tokens.refresh_token);
    return { message: 'Tokens rafraîchis' };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async logout(
    @Request() req,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    await this.authService.logout(req.user.userId);
    this.clearAuthCookies(res);
    return { message: 'Déconnexion réussie' };
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@Request() req) {
    return req.user;
  }

  // ─── Cookie Helpers ─────────────────────────────────────────

  private setAuthCookies(
    res: express.Response,
    accessToken: string,
    refreshToken: string,
  ) {
    const isProduction = process.env.NODE_ENV === 'production';

    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      maxAge: 15 * 60 * 1000, // 15 minutes
      path: '/',
    });

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/auth/refresh',
    });
  }

  private clearAuthCookies(res: express.Response) {
    res.clearCookie('access_token', { path: '/' });
    res.clearCookie('refresh_token', { path: '/auth/refresh' });
  }
}
