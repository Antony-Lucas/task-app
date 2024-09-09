import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcryptjs';
import { AccessToken, refreshTokenDTO } from 'src/types/AccessToken';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { loginDTO } from './dto/login.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserResponseDto } from './dto/user.response.dto';
import { formatUser } from 'src/utils/date.util';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async checkAuth(userId: number) {
    return this.userService.findOne(userId);
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user: User = await this.userService.findOneByEmail(email);
    if (!user) {
      throw new BadRequestException(
        'Não encontramos uma conta associada a esse endereço de email',
      );
    }
    const isAuth: boolean = bcrypt.compareSync(password, user.password);
    if (!isAuth) {
      throw new BadRequestException('Senha incorreta');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Email ou senha inválido(s)');
    }

    return formatUser(user);
  }

  async register(user: CreateUserDto): Promise<AccessToken> {
    const existingUser = await this.userService.findOneByEmail(user.email);
    if (existingUser) {
      throw new BadRequestException(
        'Este Email ja está associado a uma conta.',
      );
    }

    const hashedPassword = await bcrypt.hash(user.password, 10);
    const newUser: User = {
      ...user,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await this.userService.create(newUser);
    return this.login({ email: user.email, password: user.password });
  }

  async login(loginDto: loginDTO): Promise<{
    access_token: string;
    refresh_token: string;
    userData: UserResponseDto;
  }> {
    const { email, password } = loginDto;

    const user = await this.validateUser(email, password);
    const payload = { email: user.email, sub: user.id };
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '5m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '7d',
    });

    await this.storeRefreshToken(refreshToken, user.id);
    const userResponse: UserResponseDto = {
      id: user.id,
      username: user.username,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      userData: userResponse,
    };
  }

  async logout(refreshToken: refreshTokenDTO): Promise<void> {
    const token = await this.prisma.refreshToken.findUnique({
      where: { token: refreshToken.refresh_token },
    });

    if (!token) {
      throw new UnauthorizedException('Refresh token inválido');
    }

    await this.prisma.refreshToken.delete({
      where: { token: refreshToken.refresh_token },
    });
  }

  private async storeRefreshToken(token: string, userId: number) {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 7);

    await this.prisma.refreshToken.create({
      data: {
        token,
        userId,
        expiresAt: expirationDate,
      },
    });
  }

  async refreshToken(
    oldRefreshToken: refreshTokenDTO,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const refreshToken = await this.prisma.refreshToken.findUnique({
      where: { token: oldRefreshToken.refresh_token },
    });

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token inválido');
    }

    if (refreshToken.expiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token expirou');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: refreshToken.userId },
    });
    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado');
    }

    const payload = { email: user.email, sub: user.id };

    const newAccessToken = this.jwtService.sign(payload, {
      expiresIn: '15m',
    });

    const newRefreshToken = this.jwtService.sign(payload, {
      expiresIn: '7d',
    });

    // Atualizar o refresh token no banco de dados
    await this.prisma.refreshToken.update({
      where: { token: oldRefreshToken.refresh_token },
      data: {
        token: newRefreshToken,
        expiresAt: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return { access_token: newAccessToken, refresh_token: newRefreshToken };
  }
}
