import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
import 'reflect-metadata';
import { AppModule } from './app.module';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);
  const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:4300';
  app.enableCors({
    origin: corsOrigin,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });
  console.log('CORS enabled for origin:', corsOrigin);

  const config = new DocumentBuilder()
    .setTitle('Chinook API')
    .setDescription('API exposing Chinook Employees')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 4400;
  await app.listen(port);
  console.log(`Listening on ${port}`);
}

bootstrap();
