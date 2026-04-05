import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

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

  const config = new DocumentBuilder()
    .setTitle('Knowledge Hub API')
    .setDescription('The Knowledge Hub platform API description')
    .setVersion('1.0')
    .addTag('Users')
    .addTag('Articles')
    .addTag('Categories')
    .addTag('Comments')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('doc', app, document);

  await app.listen(port);

  console.log(`\nServer is running on: http://localhost:${port}`);
}

bootstrap();
