import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { SERVER_CONFIG } from './configuration/.env_configurations/env.config';
import { ValidationPipe } from '@nestjs/common';
import { initDb } from './database/database.provider';

async function bootstrap(): Promise<void> {
  await initDb();
  const app = await NestFactory.create(AppModule, { cors: true });
  const PORT: number = SERVER_CONFIG.APP_PORT || 3000;

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
