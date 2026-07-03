import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto): Promise<{ accessToken: string }> {
    const { email, password } = loginDto;
    const adminEmail = this.configService.get<string>('ADMIN_EMAIL');
    const adminPasswordHash = this.configService.get<string>('ADMIN_PASSWORD_HASH');

    if (!adminEmail || !adminPasswordHash) {
      throw new Error(
        'Configurações de administrador (ADMIN_EMAIL ou ADMIN_PASSWORD_HASH) ausentes no ambiente.',
      );
    }

    // 1. Valida o e-mail do admin
    if (email !== adminEmail) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    // 2. Valida a senha usando bcrypt para comparar com o hash salvo no .env
    const isPasswordMatching = await bcrypt.compare(password, adminPasswordHash);
    if (!isPasswordMatching) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    // 3. Se as credenciais estiverem corretas, gera o token JWT
    // O payload identifica que o dono do token é o administrador
    const payload = { email: adminEmail, sub: 'admin' };
    
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}

