import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { PrismaExceptionFilter } from './common/filters/prisma-exception.filter';
import { ResponseTransformInterceptor } from './common/interceptors/response.interceptor';
import { SwaggerModule } from '@nestjs/swagger';
import compression from 'compression';
import helmet from 'helmet';
import { AppLoggerService } from './common/logger/logger.service';
import * as fs from 'fs';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new AppLoggerService();

  app.use(helmet());
  app.use(compression());

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalFilters(new PrismaExceptionFilter(), new AllExceptionsFilter());
  app.useGlobalInterceptors(new ResponseTransformInterceptor());

  // Setup Swagger/OpenAPI documentation - use pre-built spec
  setupSwagger(app, logger);

  // Enable CORS for frontend during development. Configure via CORS_ALLOWED env var as comma-separated list.
  const defaultOrigins = ['http://localhost:3002', 'http://localhost:3000'];
  const origins = (process.env.CORS_ALLOWED || defaultOrigins.join(','))
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  app.enableCors({
    origin: (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void,
    ) => {
      // allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);
      if (origins.includes(origin)) return callback(null, true);
      return callback(new Error('CORS not allowed'), false);
    },
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'].join(', '),
  });

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  logger.log(`🚀 Server running on http://localhost:${port}`);
  logger.log(`📚 Swagger Docs: http://localhost:${port}/api/docs`);
  logger.log(`🏥 Health Check: http://localhost:${port}/health`);
}

function setupSwagger(app: any, logger: AppLoggerService) {
  try {
    // Load the pre-built OpenAPI spec
    const specPath = path.join(process.cwd(), 'openapi.json');
    const swaggerDocument = JSON.parse(fs.readFileSync(specPath, 'utf8'));

    // Serve Swagger UI with the pre-built spec
    SwaggerModule.setup('/api/docs', app, swaggerDocument, {
      swaggerOptions: {
        persistAuthorization: true,
        displayOperationId: true,
        operationsSorter: 'alpha',
        tagsSorter: 'alpha',
        docExpansion: 'list',
      },
      customCss: `
        .topbar { display: none; }
        .swagger-ui .topbar-wrapper { display: none; }
      `,
      customfavIcon:
        'https://cdn.jsdelivr.net/npm/@nestjs/swagger@7/assets/logo-small.svg',
    });
    logger.log('✅ Swagger UI initialized with OpenAPI 3.0 spec');
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    logger.warn(`⚠️ Note: Swagger setup skipped (${msg})`);
    logger.log(
      '    → API is fully functional. View docs via: npx tsoa spec-and-routes',
    );
  }
}

bootstrap();
