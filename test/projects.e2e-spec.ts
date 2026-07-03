import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, NotFoundException, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';

import { ProjectsController } from '../src/projects/projects.controller';
import { ProjectsService } from '../src/projects/projects.service';

const mockProject = {
  id: 'uuid-456',
  title_pt: 'Meu Projeto',
  title_en: 'My Project',
  description_pt: 'Descrição em PT',
  description_en: 'Description in EN',
  imageUrl: 'https://example.com/project.png',
  technologies: ['React', 'NestJS'],
  siteUrl: 'https://myproject.com',
  githubUrl: 'https://github.com/lucasbrito0611/myproject',
  order: 1,
  createdAt: new Date().toISOString(),
};

const validCreateDto = {
  title_pt: 'Meu Projeto',
  title_en: 'My Project',
  description_pt: 'Descrição em PT',
  description_en: 'Description in EN',
  imageUrl: 'https://example.com/project.png',
  technologies: ['React', 'NestJS'],
  siteUrl: 'https://myproject.com',
  githubUrl: 'https://github.com/lucasbrito0611/myproject',
  order: 1,
};

const mockProjectsService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('Projects (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [ProjectsController],
      providers: [
        {
          provide: ProjectsService,
          useValue: mockProjectsService,
        },
      ],
    }).compile();

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
  });

  afterEach(async () => {
    await app.close();
  });

  // -------------------------------------------------------------------------
  // GET /projects
  // -------------------------------------------------------------------------
  describe('GET /projects', () => {
    it('deve retornar 200 com a lista de projetos', async () => {
      mockProjectsService.findAll.mockResolvedValue([mockProject]);

      const response = await request(app.getHttpServer())
        .get('/projects')
        .expect(200);

      expect(response.body).toEqual([mockProject]);
    });

    it('deve retornar 200 com array vazio quando não houver projetos', async () => {
      mockProjectsService.findAll.mockResolvedValue([]);

      const response = await request(app.getHttpServer())
        .get('/projects')
        .expect(200);

      expect(response.body).toEqual([]);
    });
  });

  // -------------------------------------------------------------------------
  // GET /projects/:id
  // -------------------------------------------------------------------------
  describe('GET /projects/:id', () => {
    it('deve retornar 200 com o projeto encontrado', async () => {
      mockProjectsService.findOne.mockResolvedValue(mockProject);

      const response = await request(app.getHttpServer())
        .get('/projects/uuid-456')
        .expect(200);

      expect(response.body).toEqual(mockProject);
    });

    it('deve retornar 404 quando o projeto não existir', async () => {
      mockProjectsService.findOne.mockRejectedValue(
        new NotFoundException('Projeto com id "id-inexistente" não encontrado'),
      );

      const response = await request(app.getHttpServer())
        .get('/projects/id-inexistente')
        .expect(404);

      expect(response.body.message).toContain('id-inexistente');
    });
  });

  // -------------------------------------------------------------------------
  // POST /projects
  // -------------------------------------------------------------------------
  describe('POST /projects', () => {
    it('deve retornar 201 com o projeto criado', async () => {
      mockProjectsService.create.mockResolvedValue(mockProject);

      const response = await request(app.getHttpServer())
        .post('/projects')
        .send(validCreateDto)
        .expect(201);

      expect(response.body).toEqual(mockProject);
      expect(mockProjectsService.create).toHaveBeenCalledWith(validCreateDto);
    });

    it('deve retornar 400 quando o body estiver ausente', async () => {
      await request(app.getHttpServer())
        .post('/projects')
        .send({})
        .expect(400);
    });

    it('deve retornar 400 quando imageUrl não for uma URL válida', async () => {
      await request(app.getHttpServer())
        .post('/projects')
        .send({ ...validCreateDto, imageUrl: 'nao-e-uma-url' })
        .expect(400);
    });

    it('deve retornar 400 quando technologies não for um array', async () => {
      await request(app.getHttpServer())
        .post('/projects')
        .send({ ...validCreateDto, technologies: 'React' })
        .expect(400);
    });

    it('deve retornar 400 quando um campo desconhecido for enviado', async () => {
      await request(app.getHttpServer())
        .post('/projects')
        .send({ ...validCreateDto, campoInvalido: 'valor' })
        .expect(400);
    });
  });

  // -------------------------------------------------------------------------
  // PATCH /projects/:id
  // -------------------------------------------------------------------------
  describe('PATCH /projects/:id', () => {
    it('deve retornar 200 com o projeto atualizado', async () => {
      const updatedProject = { ...mockProject, title_pt: 'Projeto Atualizado' };
      mockProjectsService.update.mockResolvedValue(updatedProject);

      const response = await request(app.getHttpServer())
        .patch('/projects/uuid-456')
        .send({ title_pt: 'Projeto Atualizado' })
        .expect(200);

      expect(response.body.title_pt).toBe('Projeto Atualizado');
    });

    it('deve retornar 404 quando o projeto não existir', async () => {
      mockProjectsService.update.mockRejectedValue(
        new NotFoundException('Projeto com id "id-inexistente" não encontrado'),
      );

      await request(app.getHttpServer())
        .patch('/projects/id-inexistente')
        .send({ title_pt: 'Qualquer' })
        .expect(404);
    });
  });

  // -------------------------------------------------------------------------
  // DELETE /projects/:id
  // -------------------------------------------------------------------------
  describe('DELETE /projects/:id', () => {
    it('deve retornar 200 quando o projeto for deletado', async () => {
      mockProjectsService.remove.mockResolvedValue(undefined);

      await request(app.getHttpServer())
        .delete('/projects/uuid-456')
        .expect(200);

      expect(mockProjectsService.remove).toHaveBeenCalledWith('uuid-456');
    });

    it('deve retornar 404 quando o projeto não existir', async () => {
      mockProjectsService.remove.mockRejectedValue(
        new NotFoundException('Projeto com id "id-inexistente" não encontrado'),
      );

      await request(app.getHttpServer())
        .delete('/projects/id-inexistente')
        .expect(404);
    });
  });
});
