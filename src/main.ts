import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Logger, ValidationPipe } from '@nestjs/common';
import { getConfigVar } from './utils/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.setGlobalPrefix('api/v1');
  app.enableCors();

  const option = new DocumentBuilder()
    .setTitle('ABC API TESTER')
    .setDescription('List of Apis')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter Jwt Token',
        in: 'header',
      },
      'access-token',
    )
    .setExternalDoc('Postman Collection', '/api-tester-json')
    .build();
  const document = SwaggerModule.createDocument(app, option);
  SwaggerModule.setup('/api-tester', app, document);

  const port = getConfigVar('PORT') || 3000;
  await app.listen(port);
  Logger.log('port is running on ' + port);
}
bootstrap();
