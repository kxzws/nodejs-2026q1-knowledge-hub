import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

import { AppModule } from './app.module';
import { NotFoundExceptionFilter } from './common/filters/not-found.filter';

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new NotFoundExceptionFilter());

  await app.listen(PORT);
}

bootstrap();
