import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { TerminusModule } from '@nestjs/terminus';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { SkillsModule } from './skills/skills.module';
import { ProjectsModule } from './projects/projects.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const databaseUrl = config.get<string>('DATABASE_URL');
        return {
          type: 'postgres',
          ...(databaseUrl
            ? { url: databaseUrl }
            : {
                host: config.get<string>('DB_HOST') || 'localhost',
                port: config.get<number>('DB_PORT') || 5432,
                username: config.get<string>('DB_USERNAME') || 'portfolio',
                password: config.get<string>('DB_PASSWORD') || 'portfolio',
                database: config.get<string>('DB_DATABASE') || 'portfolio',
              }),
          entities: [__dirname + '/**/*.entity.{js,ts}'],
          synchronize: false,
          ssl: databaseUrl ? { rejectUnauthorized: false } : false,
        };
      },
    }),
    ThrottlerModule.forRoot([{
      name: 'default',
      ttl: 60_000, 
      limit: 100,  
    }]),
    TerminusModule,
    SkillsModule,
    ProjectsModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
