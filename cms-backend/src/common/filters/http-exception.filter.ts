import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    console.error('Exception caught:', {
      type: exception?.constructor?.name,
      message:
        exception instanceof Error ? exception.message : String(exception),
      // Add code if it's a Prisma error
      code: (exception as any)?.code,
    });

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: any = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      message = (res as any).message ?? res;
    } else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      switch (exception.code) {
        case 'P2002': {
          // Unique constraint failed
          const target = exception.meta?.target as string[] | undefined;
          const field = target?.[0] ?? 'field';
          status = HttpStatus.CONFLICT;
          message = `A record with this ${field} already exists`;
          break;
        }

        case 'P2025': {
          // Record not found
          status = HttpStatus.NOT_FOUND;
          message = 'Record not found';
          break;
        }

        case 'P2003': {
          // Foreign key constraint failed
          const field = exception.meta?.field_name ?? 'field';
          status = HttpStatus.BAD_REQUEST;
          message = `Invalid reference: the specified ${field} does not exist`;
          break;
        }

        case 'P2014': {
          // Required relation violation
          status = HttpStatus.BAD_REQUEST;
          message = 'Cannot delete record because it has related records';
          break;
        }

        case 'P2011': {
          // Null constraint violation
          const field = exception.meta?.column_name ?? 'field';
          status = HttpStatus.BAD_REQUEST;
          message = `Missing required field: ${field}`;
          break;
        }

        case 'P2012':
        case 'P2013': {
          // Missing required argument
          status = HttpStatus.BAD_REQUEST;
          message = 'Missing required argument';
          break;
        }

        default:
          status = HttpStatus.INTERNAL_SERVER_ERROR;
          message = `Database error: ${exception.message}`;
      }
    } else if (exception instanceof Prisma.PrismaClientValidationError) {
      // Validation errors
      status = HttpStatus.BAD_REQUEST;
      message = 'Validation error: Invalid input for database operation';
    } else if (exception instanceof Prisma.PrismaClientRustPanicError) {
      // Rust panic errors
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Database error: An internal database error occurred';
    } else if (exception instanceof Error) {
      // Generic errors
      if (exception.message.includes('target')) {
        status = HttpStatus.BAD_REQUEST;
        message = exception.message;
      }
    } else if (exception instanceof Error) {
      message = exception.message || 'An error occurred';
    }

    response.status(status).json({
      success: false,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
