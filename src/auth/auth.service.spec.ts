import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';


const MOCK_ADMIN_EMAIL = 'admin@example.com';
const MOCK_PASSWORD = '123456';
const MOCK_PASSWORD_HASH = '$2b$10$DD6QYpRlW.YLJK9HRREW.exUxLpBxpwJObhBSMb1Oq3FKYpmV9MN2';

const mockConfigService = {
  get: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn(),
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: ConfigService, useValue: mockConfigService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);

    jest.clearAllMocks();

    mockConfigService.get.mockImplementation((key: string) => {
      if (key === 'ADMIN_EMAIL') return MOCK_ADMIN_EMAIL;
      if (key === 'ADMIN_PASSWORD_HASH') return MOCK_PASSWORD_HASH;
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });


  describe('login', () => {

    it('deve retornar um accessToken quando as credenciais são válidas', async () => {
      // ARRANGE — preparamos o cenário do teste
      const fakeToken = 'jwt-token-falso';
      // Configuramos o mock do JwtService para retornar um token controlado
      mockJwtService.sign.mockReturnValue(fakeToken);

      // ACT — executamos a ação que queremos testar
      const result = await service.login({
        email: MOCK_ADMIN_EMAIL,
        password: MOCK_PASSWORD,
      });

      // ASSERT — verificamos o resultado
      expect(result).toEqual({ accessToken: fakeToken });
      // Verificamos também que o jwtService.sign foi chamado (comportamento esperado)
      expect(mockJwtService.sign).toHaveBeenCalledTimes(1);
    });

    it('deve lançar UnauthorizedException quando o email está errado', async () => {
      // CONCEITO: rejects.toThrow() é a forma de testar que uma Promise
      // assíncrona foi rejeitada com um erro específico
      await expect(
        service.login({ email: 'hacker@evil.com', password: MOCK_PASSWORD }),
      ).rejects.toThrow(UnauthorizedException);

      // Garantimos que o JWT nunca foi gerado — seria um bug de segurança
      expect(mockJwtService.sign).not.toHaveBeenCalled();
    });

    it('deve lançar UnauthorizedException quando a senha está errada', async () => {
      await expect(
        service.login({ email: MOCK_ADMIN_EMAIL, password: 'senha-errada' }),
      ).rejects.toThrow(UnauthorizedException);

      expect(mockJwtService.sign).not.toHaveBeenCalled();
    });

    it('deve lançar Error quando ADMIN_EMAIL não está configurado no ambiente', async () => {
      // Sobrescrevemos o mock padrão do beforeEach para simular configuração ausente
      mockConfigService.get.mockReturnValue(undefined);

      await expect(
        service.login({ email: MOCK_ADMIN_EMAIL, password: MOCK_PASSWORD }),
      ).rejects.toThrow('Configurações de administrador');
    });

    it('deve gerar o token com o payload correto (email + sub)', async () => {
      mockJwtService.sign.mockReturnValue('token');

      await service.login({ email: MOCK_ADMIN_EMAIL, password: MOCK_PASSWORD });

      // toHaveBeenCalledWith() verifica os argumentos com que a função foi chamada
      // Isso protege o "contrato" do payload — se alguém mudar o payload, o teste quebra
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        email: MOCK_ADMIN_EMAIL,
        sub: 'admin',
      });
    });
  });
});
