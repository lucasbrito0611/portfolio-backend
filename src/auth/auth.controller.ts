import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@ApiTags('auth') // ← Agrupa todos os endpoints deste controller na seção "auth" da UI
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Autenticar usuário e obter token JWT' })
  @ApiOkResponse({ description: 'Login realizado com sucesso. Retorna o access_token JWT.' })
  @ApiUnauthorizedResponse({ description: 'Credenciais inválidas.' })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}