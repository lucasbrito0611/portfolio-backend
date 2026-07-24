import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { HealthCheckService, TypeOrmHealthIndicator } from '@nestjs/terminus';

const mockHealthCheckResult = { status: 'ok', info: { database: { status: 'up' } } };

const mockHealthCheckService = {
  check: jest.fn().mockResolvedValue(mockHealthCheckResult),
};

const mockTypeOrmHealthIndicator = {
  pingCheck: jest.fn().mockResolvedValue({ database: { status: 'up' } }),
};

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        { provide: HealthCheckService, useValue: mockHealthCheckService },
        { provide: TypeOrmHealthIndicator, useValue: mockTypeOrmHealthIndicator },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(appController).toBeDefined();
  });

  describe('check', () => {
    it('deve chamar o health check do banco e retornar o resultado', async () => {
      const result = await appController.check();
      expect(mockHealthCheckService.check).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockHealthCheckResult);
    });
  });
});
