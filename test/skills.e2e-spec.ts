import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, NotFoundException, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';

import { SkillsController } from '../src/skills/skills.controller';
import { SkillsService } from '../src/skills/skills.service';
import { JwtAuthGuard } from '../src/auth/jwt-auth.guard';

const mockSkill = {
  id: 'uuid-123',
  name: 'NestJS',
  description: 'Framework Node.js',
  imageUrl: 'https://example.com/nestjs.png',
  docUrl: 'https://docs.nestjs.com',
  className: 'devicon-nestjs-plain',
  order: 1,
  createdAt: new Date().toISOString(),
};

const validCreateDto = {
  name: 'NestJS',
  description: 'Framework Node.js',
  imageUrl: 'https://example.com/nestjs.png',
  docUrl: 'https://docs.nestjs.com',
  className: 'devicon-nestjs-plain',
  order: 1,
};

const mockSkillsService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

const mockJwtAuthGuard = {
  canActivate: jest.fn().mockReturnValue(true),
};

// ---------------------------------------------------------------------------
// Suite de testes E2E
// ---------------------------------------------------------------------------
describe('Skills (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [SkillsController],
      providers: [
        {
          provide: SkillsService,
          useValue: mockSkillsService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(mockJwtAuthGuard)
      .compile();

    app = moduleFixture.createNestApplication();

    // Aplicamos o mesmo ValidationPipe do main.ts para testar a validação real
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

  // -------------------------------------------------------------------------
  // GET /skills
  // -------------------------------------------------------------------------
  describe('GET /skills', () => {
    it('deve retornar 200 com a lista de skills', async () => {
      mockSkillsService.findAll.mockResolvedValue([mockSkill]);

      const response = await request(app.getHttpServer())
        .get('/skills')
        .expect(200);

      expect(response.body).toEqual([mockSkill]);
    });

    it('deve retornar 200 com array vazio quando não houver skills', async () => {
      mockSkillsService.findAll.mockResolvedValue([]);

      const response = await request(app.getHttpServer())
        .get('/skills')
        .expect(200);

      expect(response.body).toEqual([]);
    });
  });

  // -------------------------------------------------------------------------
  // GET /skills/:id
  // -------------------------------------------------------------------------
  describe('GET /skills/:id', () => {
    it('deve retornar 200 com o skill encontrado', async () => {
      mockSkillsService.findOne.mockResolvedValue(mockSkill);

      const response = await request(app.getHttpServer())
        .get('/skills/uuid-123')
        .expect(200);

      expect(response.body).toEqual(mockSkill);
    });

    it('deve retornar 404 quando o skill não existir', async () => {
      // O service lança NotFoundException, o NestJS converte para 404 automaticamente
      mockSkillsService.findOne.mockRejectedValue(
        new NotFoundException('Skill com id "id-inexistente" não encontrado'),
      );

      const response = await request(app.getHttpServer())
        .get('/skills/id-inexistente')
        .expect(404);

      expect(response.body.message).toContain('id-inexistente');
    });
  });

  // -------------------------------------------------------------------------
  // POST /skills
  // -------------------------------------------------------------------------
  describe('POST /skills', () => {
    it('deve retornar 201 com o skill criado', async () => {
      mockSkillsService.create.mockResolvedValue(mockSkill);

      const response = await request(app.getHttpServer())
        .post('/skills')
        .send(validCreateDto)
        .expect(201);

      expect(response.body).toEqual(mockSkill);
      expect(mockSkillsService.create).toHaveBeenCalledWith(validCreateDto);
    });

    it('deve retornar 400 quando o body estiver ausente', async () => {
      await request(app.getHttpServer())
        .post('/skills')
        .send({})
        .expect(400);
    });

    it('deve retornar 400 quando imageUrl não for uma URL válida', async () => {
      await request(app.getHttpServer())
        .post('/skills')
        .send({ ...validCreateDto, imageUrl: 'nao-e-uma-url' })
        .expect(400);
    });

    it('deve retornar 400 quando um campo desconhecido for enviado', async () => {
      // forbidNonWhitelisted: true rejeita campos não declarados no DTO
      await request(app.getHttpServer())
        .post('/skills')
        .send({ ...validCreateDto, campoInexistente: 'valor' })
        .expect(400);
    });
  });

  // -------------------------------------------------------------------------
  // PATCH /skills/:id
  // -------------------------------------------------------------------------
  describe('PATCH /skills/:id', () => {
    it('deve retornar 200 com o skill atualizado', async () => {
      const updatedSkill = { ...mockSkill, name: 'NestJS v2' };
      mockSkillsService.update.mockResolvedValue(updatedSkill);

      const response = await request(app.getHttpServer())
        .patch('/skills/uuid-123')
        .send({ name: 'NestJS v2' })
        .expect(200);

      expect(response.body.name).toBe('NestJS v2');
    });

    it('deve retornar 404 quando o skill não existir', async () => {
      mockSkillsService.update.mockRejectedValue(
        new NotFoundException('Skill com id "id-inexistente" não encontrado'),
      );

      await request(app.getHttpServer())
        .patch('/skills/id-inexistente')
        .send({ name: 'Qualquer' })
        .expect(404);
    });
  });

  // -------------------------------------------------------------------------
  // DELETE /skills/:id
  // -------------------------------------------------------------------------
  describe('DELETE /skills/:id', () => {
    it('deve retornar 200 quando o skill for deletado', async () => {
      mockSkillsService.remove.mockResolvedValue(undefined);

      await request(app.getHttpServer())
        .delete('/skills/uuid-123')
        .expect(200);

      expect(mockSkillsService.remove).toHaveBeenCalledWith('uuid-123');
    });

    it('deve retornar 404 quando o skill não existir', async () => {
      mockSkillsService.remove.mockRejectedValue(
        new NotFoundException('Skill com id "id-inexistente" não encontrado'),
      );

      await request(app.getHttpServer())
        .delete('/skills/id-inexistente')
        .expect(404);
    });
  });
});
