import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, RequestMethod } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  app.setGlobalPrefix('api/v1', {
    exclude: [{ path: '/', method: RequestMethod.GET }],
  });

  // Habilita CORS para que o frontend possa fazer requisições à API.
  app.enableCors({
    origin: (origin, callback) => {
      const allowed = process.env.FRONTEND_URL;
      if (!allowed) throw new Error('FRONTEND_URL não configurada!');
      callback(null, origin === allowed);
    },
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // Configuração do documento OpenAPI
  const config = new DocumentBuilder()
    .setTitle('Portfolio API')
    .setDescription('API REST do portfólio pessoal — gerencia projetos e skills')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Serve a UI interativa em GET /api
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}
bootstrap();

