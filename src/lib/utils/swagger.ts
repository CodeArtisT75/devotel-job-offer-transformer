import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function registerSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Devotel Job Offer Transformer API')
    .setDescription('API documentation for Devotel Job Offer Transformer')
    .setVersion('1.0')
    .addTag('Home')
    .addTag('JobOffers')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory);
}
