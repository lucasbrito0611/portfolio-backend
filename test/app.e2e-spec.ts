import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { HealthCheckService, TypeOrmHealthIndicator } from '@nestjs/terminus';

import { AppController } from '../src/app.controller';

// O AppController usa o @nestjs/terminus para health check.
// Mockamos os dois providers que ele precisa para não depender de banco de dados.
const mockHealthCheckService = {
  check: jest.fn().mockResolvedValue({
    status: 'ok',
    info: { database: { status: 'up' } },
    error: {},
    details: { database: { status: 'up' } },
  }),
};

const mockTypeOrmHealthIndicator = {
  pingCheck: jest.fn().mockResolvedValue({ database: { status: 'up' } }),
};

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        { provide: HealthCheckService, useValue: mockHealthCheckService },
        { provide: TypeOrmHealthIndicator, useValue: mockTypeOrmHealthIndicator },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    jest.clearAllMocks();
  });

  it('GET / deve retornar 200 com o status do health check', async () => {
    const response = await request(app.getHttpServer())
      .get('/')
      .expect(200);

    expect(response.body.status).toBe('ok');
    expect(response.body.info.database.status).toBe('up');
  });

  afterEach(async () => {
    await app.close();
  });
});
