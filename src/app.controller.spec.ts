import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { HealthCheckService, TypeOrmHealthIndicator } from '@nestjs/terminus';

const mockHealthCheckService = {
  check: jest.fn().mockResolvedValue({ status: 'ok' }),
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
    it('should return health check result', async () => {
      const result = await appController.check();
      expect(mockHealthCheckService.check).toHaveBeenCalledTimes(1);
      expect(result).toEqual({ status: 'ok' });
    });
  });
});
