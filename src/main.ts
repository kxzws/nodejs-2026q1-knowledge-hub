import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

import { AppModule } from './app.module';
// import { NotFoundExceptionFilter } from './common/filters/not-found.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 3000;

  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  // app.useGlobalFilters(new NotFoundExceptionFilter());

  await app.listen(port);

  console.log(`\nApplication is running on: http://localhost:${port}`);
}

bootstrap();
