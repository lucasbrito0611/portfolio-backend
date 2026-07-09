import { Controller, Post, Get, Body, HttpCode, HttpStatus, UseGuards, Res } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse, ApiUnauthorizedResponse, ApiBearerAuth } from '@nestjs/swagger';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Throttle } from '@nestjs/throttler';

const COOKIE_MAX_AGE = 24 * 60 * 60 * 1000;

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 5, ttl: 30000 } }) // Limita a 5 tentativas por minuto por IP
  @ApiOperation({ summary: 'Autenticar usuário e obter sessão via cookie HttpOnly' })
  @ApiOkResponse({ description: 'Login realizado. Cookie admin_token definido.' })
  @ApiUnauthorizedResponse({ description: 'Credenciais inválidas.' })
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken } = await this.authService.login(loginDto);

    res.cookie('admin_token', accessToken, {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      maxAge: COOKIE_MAX_AGE,
    });

    return { ok: true };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Verificar se há sessão ativa' })
  @ApiOkResponse({ description: 'Sessão ativa.' })
  @ApiUnauthorizedResponse({ description: 'Sem sessão ativa ou sessão expirada.' })
  me() {
    return { ok: true };
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Encerrar sessão e limpar cookie' })
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('admin_token', {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
    });
  }
}