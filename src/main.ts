import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger config
  const config = new DocumentBuilder()
    .setTitle('Organizations API')
    .setDescription('The Organizations and Notifications API description')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app as any, config);

  SwaggerModule.setup('api', app as any, document);

  await app.listen(3000);
}
bootstrap();