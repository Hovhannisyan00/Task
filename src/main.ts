import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { SERVER_CONFIG } from './configuration/.env_configurations/env.config';
import { initDb } from './database/database.provider';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap(): Promise<void> {
  await initDb();
  const app = await NestFactory.create(AppModule, { cors: true });
  const PORT: number = SERVER_CONFIG.APP_PORT || 3000;

  app.enableCors({
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    exposedHeaders: ['Set-Cookie', 'Content-Disposition'],
    allowedHeaders: ['Authorization', 'X-Api-Key'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen(PORT ?? 3000);

  console.log(`Server is running at http://localhost:${PORT}`);
}

bootstrap();
