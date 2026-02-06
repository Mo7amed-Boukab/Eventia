import { Injectable, UnauthorizedException, BadRequestException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../users/schemas/user.schema';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) { }

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
  async hashData(data: string): Promise<string> {
    return bcrypt.hash(data, 10);
  }

  async updateRefreshToken(userId: string, refreshToken: string | null) {
    await this.userModel.findByIdAndUpdate(userId, { refreshToken });
  }

  // ----------------------------------------------------------------------
  // Enregistrer un nouvel utilisateur
  async register(registerDto: RegisterDto) {
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await this.userModel.findOne({ email: registerDto.email });
    if (existingUser) {
      throw new ConflictException('Cet email est déjà utilisé');
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // Créer l'utilisateur
    const newUser = new this.userModel({
      ...registerDto,
      password: hashedPassword,
    });

    try {
      const savedUser = await newUser.save();
      const userId = savedUser._id.toString();

      // Générer les tokens
      const tokens = await this.generateTokens(userId, savedUser.email, savedUser.role);

      // Hasher et sauvegarder le refresh token
      const hashedRefreshToken = await this.hashData(tokens.refreshToken);
      await this.updateRefreshToken(userId, hashedRefreshToken);

      return {
        access_token: tokens.accessToken,
        refresh_token: tokens.refreshToken,
        user: {
          id: userId,
          email: savedUser.email,
          first_name: savedUser.first_name,
          last_name: savedUser.last_name,
          role: savedUser.role,
        },
      };
    } catch (error) {
      throw new BadRequestException("Erreur lors de l'enregistrement de l'utilisateur");
    }
  }

  // ----------------------------------------------------------------------
  // Valider un utilisateur (email + password)
  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userModel.findOne({ email });

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
    const user = await this.userModel.findOne({ email: loginDto.email });

    if (!user) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    const userId = user._id.toString();

    // Générer les tokens
    const tokens = await this.generateTokens(userId, user.email, user.role);

    // Hasher et sauvegarder le refresh token
    const hashedRefreshToken = await this.hashData(tokens.refreshToken);
    await this.updateRefreshToken(userId, hashedRefreshToken);

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
    const user = await this.userModel.findById(userId);

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
    const hashedRefreshToken = await this.hashData(tokens.refreshToken);
    await this.updateRefreshToken(userId, hashedRefreshToken);

    return {
      access_token: tokens.accessToken,
      refresh_token: tokens.refreshToken,
    };
  }

  // ----------------------------------------------------------------------
  // Déconnexion (supprime le refresh token)
  async logout(userId: string) {
    await this.updateRefreshToken(userId, null);
    return { message: 'Déconnexion réussie' };
  }
}
