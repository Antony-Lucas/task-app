import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { LocalAuthGuard } from './guards/local.auth.guard';
import { Public } from './decorator/public.decorator';
import { loginDTO } from './dto/login.dto';
import { ApiTags } from '@nestjs/swagger';
import { refreshTokenDTO } from 'src/types/AccessToken';
import { JwtAuthCheck } from './midleware/jwt.auth.check';
import { AuthenticatedRequest } from 'src/types/AuthenticatedRequest';
import { UserResponseDto } from './dto/user.response.dto';

@Public()
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(@Body() body: CreateUserDto) {
    return this.authService.register(body);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Body() body: loginDTO) {
    return this.authService.login(body);
  }

  @Post('logout')
  logout(@Body() body: refreshTokenDTO) {
    return this.authService.logout(body);
  }

  @Post('refresh_token')
  refreshToken(@Body() body: refreshTokenDTO) {
    return this.authService.refreshToken(body);
  }

  @UseGuards(JwtAuthCheck)
  @Get('check')
  async checkAuth(
    @Request() req: AuthenticatedRequest,
  ): Promise<UserResponseDto> {
    const userId = req.user?.sub;
    if (!userId) {
      throw new UnauthorizedException('Usuário não autenticado');
    }

    const user = await this.authService.checkAuth(userId);
    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado');
    }

    return {
      id: user.id,
      username: user.username,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
