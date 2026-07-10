import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UnauthorizedException } from '@nestjs/common';

const mockAuthService = {
  login: jest.fn(),
};

const mockResponse = {
  cookie: jest.fn(),
  clearCookie: jest.fn(),
};

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {

    it('deve definir o cookie admin_token e retornar { ok: true }', async () => {
      const fakeToken = 'jwt-token-falso';
      // Configuramos o mock para simular um login bem-sucedido no service
      mockAuthService.login.mockResolvedValue({ accessToken: fakeToken });

      const result = await controller.login(
        { email: 'admin@example.com', password: '123456' },
        mockResponse as any,
      );

      // Verificamos que o cookie foi definido com o token correto
      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'admin_token',
        fakeToken,
        expect.objectContaining({ httpOnly: true, sameSite: 'strict' }),
      );

      // Verificamos que o retorno do controller é o esperado
      expect(result).toEqual({ ok: true });
    });

    it('deve propagar UnauthorizedException quando o service rejeita', async () => {
      // Simulamos que o AuthService lançou um erro de autenticação
      mockAuthService.login.mockRejectedValue(new UnauthorizedException('Credenciais inválidas'));

      await expect(
        controller.login(
          { email: 'errado@test.com', password: 'errada' },
          mockResponse as any,
        ),
      ).rejects.toThrow(UnauthorizedException);

      // Cookie NÃO deve ter sido definido quando o login falhou
      expect(mockResponse.cookie).not.toHaveBeenCalled();
    });
  });

  describe('me', () => {
    it('deve retornar { ok: true }', () => {
      // Método simples — só verifica que a rota responde corretamente
      // (A proteção via JwtAuthGuard é testada em testes E2E)
      expect(controller.me()).toEqual({ ok: true });
    });
  });

  describe('logout', () => {
    it('deve limpar o cookie admin_token', () => {
      controller.logout(mockResponse as any);

      expect(mockResponse.clearCookie).toHaveBeenCalledWith(
        'admin_token',
        expect.objectContaining({ httpOnly: true, sameSite: 'strict' }),
      );
    });
  });
});
