import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe, UnauthorizedException } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';

import { AuthController } from '../src/auth/auth.controller';
import { AuthService } from '../src/auth/auth.service';
import { JwtAuthGuard } from '../src/auth/jwt-auth.guard';


const mockAuthService = {
  login: jest.fn(),
};

const mockJwtAuthGuard = {
  canActivate: jest.fn().mockReturnValue(true),
};

describe('Auth (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
      ],
    })

      .overrideGuard(JwtAuthGuard)
      .useValue(mockJwtAuthGuard)
      .compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();

    jest.clearAllMocks();

    mockJwtAuthGuard.canActivate.mockReturnValue(true);
  });

  afterEach(async () => {
    await app.close();
  });

  // ---------------------------------------------------------------------------
  // POST /auth/login
  // ---------------------------------------------------------------------------
  describe('POST /auth/login', () => {

    it('deve retornar 200, { ok: true } e definir o cookie admin_token', async () => {
      mockAuthService.login.mockResolvedValue({ accessToken: 'token-jwt-fake' });

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'admin@example.com', password: '123456' })
        .expect(200);

      expect(response.body).toEqual({ ok: true });

      const setCookieHeader = response.headers['set-cookie'] as unknown as string[];
      expect(setCookieHeader).toBeDefined();
      expect(setCookieHeader.some((c: string) => c.startsWith('admin_token='))).toBe(true);
    });

    it('deve retornar 401 quando o service rejeitar as credenciais', async () => {
      mockAuthService.login.mockRejectedValue(new UnauthorizedException('Credenciais inválidas'));

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'errado@test.com', password: '123456' })
        .expect(401);

      expect(response.body.message).toBe('Credenciais inválidas');
    });

    it('deve retornar 400 quando o email for inválido', async () => {
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'nao-e-um-email', password: '123456' })
        .expect(400);
    });

    it('deve retornar 400 quando a senha tiver menos de 6 caracteres', async () => {
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'admin@example.com', password: '12345' })
        .expect(400);
    });

    it('deve retornar 400 quando o body estiver vazio', async () => {
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({})
        .expect(400);
    });

    it('deve retornar 400 quando um campo desconhecido for enviado (forbidNonWhitelisted)', async () => {
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'admin@example.com', password: '123456', campoHacker: 'valor' })
        .expect(400);
    });
  });

  // ---------------------------------------------------------------------------
  // GET /auth/me
  // ---------------------------------------------------------------------------
  describe('GET /auth/me', () => {

    it('deve retornar 200 quando o guard permitir acesso', async () => {
      // Guard configurado para retornar true (autenticado) no beforeEach
      const response = await request(app.getHttpServer())
        .get('/auth/me')
        .expect(200);

      expect(response.body).toEqual({ ok: true });
    });

    it('deve retornar 403 quando o guard bloquear o acesso', async () => {
      mockJwtAuthGuard.canActivate.mockReturnValue(false);

      await request(app.getHttpServer())
        .get('/auth/me')
        .expect(403);
    });
  });

  // ---------------------------------------------------------------------------
  // POST /auth/logout
  // ---------------------------------------------------------------------------
  describe('POST /auth/logout', () => {

    it('deve retornar 204 e limpar o cookie admin_token', async () => {
      // Guard autenticado por padrão no beforeEach
      const response = await request(app.getHttpServer())
        .post('/auth/logout')
        .expect(204);

      // Verificamos que o Set-Cookie foi enviado para limpar o cookie
      const setCookieHeader = response.headers['set-cookie'] as unknown as string[];
      expect(setCookieHeader).toBeDefined();
      expect(setCookieHeader.some((c: string) => c.includes('admin_token=;'))).toBe(true);
    });

    it('deve retornar 403 sem autenticação', async () => {
      mockJwtAuthGuard.canActivate.mockReturnValue(false);

      await request(app.getHttpServer())
        .post('/auth/logout')
        .expect(403);
    });
  });
});
