import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

export function setupSwagger(app: INestApplication, logger: any) {
  try {
    const config = new DocumentBuilder()
      .setTitle('Full-Stack CMS API')
      .setDescription(
        'Enterprise-grade REST API for a full-stack CMS with JWT auth and RBAC',
      )
      .setVersion('1.0.0')
      .addBearerAuth()
      .addTag('auth', 'Authentication & Login')
      .addTag('users', 'User Management')
      .addTag('roles', 'Role Management')
      .addTag('permissions', 'Permission Management')
      .addTag('blogs', 'Blog Post Management')
      .addTag('news', 'News Management')
      .addTag('health', 'Health Checks')
      .build();

    // Create document with minimal schema generation to avoid scanner issues
    const options = {
      ignoreGlobalPrefix: false,
      operationIdFactory: (controllerKey: string, methodKey: string) =>
        `${controllerKey}_${methodKey}`,
      deepScanRoutes: false,
    };

    const document = SwaggerModule.createDocument(app, config, options);

    SwaggerModule.setup('/api/docs', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
        displayOperationId: true,
        operationsSorter: 'alpha',
        tagsSorter: 'alpha',
      },
      customfavIcon:
        'https://cdn.jsdelivr.net/npm/@nestjs/swagger@7/assets/logo-small.svg',
    });

    logger.log('📚 Swagger UI available at http://localhost:3000/api/docs');
    return true;
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    logger.warn(
      `Note: Swagger UI unavailable (${msg}) - use openapi.json for documentation`,
    );
    return false;
  }
}
