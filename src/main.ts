import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('OkeyKitty')
    .setDescription('API документация')
    .setVersion('1.0')
    .addTag('OkeyKitty')
    .addCookieAuth(
      'authCookie',
      {
        type: 'http',
        in: 'Header',
        scheme: 'Bearer',
      },
      'refreshToken',
    )
    .addBearerAuth(
      {
        description: 'JWT Authorization for administrator',
        type: 'http',
        in: 'header',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'administrator',
    )
    .addBearerAuth(
      {
        description: 'JWT Authorization for all',
        type: 'http',
        in: 'header',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'all',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  app.enableCors({
    credentials: true,
    origin: process.env.CLIENT_URL,
  });

  app.use(cookieParser());

  // конвертация и проверка входящий данных
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // Для использования @Exclude()
  // app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  await app.listen(80);
}
bootstrap();
