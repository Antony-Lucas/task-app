import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { LocalAuthGuard } from './guards/local.auth.guard';
import { Public } from './decorator/public.decorator';
import { loginDTO } from './dto/login.dto';
import { ApiTags } from '@nestjs/swagger';
import { refreshTokenDTO } from 'src/types/AccessToken';
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
}
