import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { cors } from 'config/cors';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);


  app.enableCors(cors);
  
  const config = new DocumentBuilder()
  .setTitle('User API Document')
  .setDescription('user API Document')
  .setVersion('1.0')
  .addTag('User')
  .addBearerAuth(
    { type: 'http', scheme: 'bearer', bearerFormat: 'JWT', in: 'header' },
    'accessToken',
  )
  .build();

const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('openapi', app, document);

  await app.listen(3001);
}
bootstrap();
