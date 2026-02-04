import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  // Générer les tokens (access + refresh)
  async generateTokens(userId: string, email: string, role: string) {
    const payload = { sub: userId, email, role };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: '7d',
      }),
    ]);

    return { accessToken, refreshToken };
  }

  // Hash le refresh token avant de le sauvegarder
  async hashToken(token: string): Promise<string> {
    return bcrypt.hash(token, 10);
  }

  // ----------------------------------------------------------------------
  // Enregistrer un nouvel utilisateur
  async register(registerDto: RegisterDto) {
    const user = await this.usersService.create(registerDto);
    const userObj = user.toObject();
    const userId = userObj._id.toString();

    // Générer les tokens
    const tokens = await this.generateTokens(userId, user.email, user.role);

    // Hasher et sauvegarder le refresh token
    const hashedRefreshToken = await this.hashToken(tokens.refreshToken);
    await this.usersService.updateRefreshToken(userId, hashedRefreshToken);

    return {
      access_token: tokens.accessToken,
      refresh_token: tokens.refreshToken,
      user: {
        id: userId,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
      },
    };
  }
  // ----------------------------------------------------------------------
  // Valider un utilisateur (email + password)
  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return null;
    }

    const { password: _, refreshToken: __, ...result } = user.toObject();
    return result;
  }

  // ----------------------------------------------------------------------
  // Connexion
  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);

    if (!user) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    const userId = user._id.toString();

    // Générer les tokens
    const tokens = await this.generateTokens(userId, user.email, user.role);

    // Hasher et sauvegarder le refresh token
    const hashedRefreshToken = await this.hashToken(tokens.refreshToken);
    await this.usersService.updateRefreshToken(userId, hashedRefreshToken);

    return {
      access_token: tokens.accessToken,
      refresh_token: tokens.refreshToken,
      user: {
        id: userId,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
      },
    };
  }

  // ----------------------------------------------------------------------
  // Rafraîchir l'access token avec le refresh token
  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.usersService.findOneWithRefreshToken(userId);

    if (!user || !user.refreshToken) {
      throw new UnauthorizedException('Accès refusé');
    }

    // Vérifier si le refresh token correspond
    const refreshTokenMatches = await bcrypt.compare(
      refreshToken,
      user.refreshToken,
    );

    if (!refreshTokenMatches) {
      throw new UnauthorizedException('Accès refusé');
    }

    // Générer de nouveaux tokens
    const tokens = await this.generateTokens(userId, user.email, user.role);

    // Mettre à jour le refresh token
    const hashedRefreshToken = await this.hashToken(tokens.refreshToken);
    await this.usersService.updateRefreshToken(userId, hashedRefreshToken);

    return {
      access_token: tokens.accessToken,
      refresh_token: tokens.refreshToken,
    };
  }
  
  // ----------------------------------------------------------------------
  // Déconnexion (supprime le refresh token)
  async logout(userId: string) {
    await this.usersService.updateRefreshToken(userId, null);
    return { message: 'Déconnexion réussie' };
  }
}
