import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { GlobalExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. Apply the Global Exception Filter (Bonus Requirement)
  app.useGlobalFilters(new GlobalExceptionFilter());

  // 2. Enable Global Request Body Validation and DTO Type Transformation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,        // Automatically strip out properties not explicitly declared in DTOs
      transform: true,        // Convert URL query strings automatically into designated types (e.g., string to number)
      forbidNonWhitelisted: true, // Reject payloads containing unmapped data fields with a 400 Bad Request
    }),
  );

  // 3. Configure and Initialize Swagger Interactive Documentation UI
  const config = new DocumentBuilder()
    .setTitle('EN2H Booking Platform REST API')
    .setDescription('The core backend API engine for managing customer services and appointment bookings.')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter your valid JWT access token string here',
        in: 'header',
      },
      'bearer', // This matching string key binds directly to the controllers via @ApiBearerAuth()
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // 4. Start HTTP Server Listening Layer
  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`🚀 EN2H Engine is running live at: http://localhost:${port}`);
  console.log(`📖 Interactive API Documentation is live at: http://localhost:${port}/api/docs`);
}
bootstrap();