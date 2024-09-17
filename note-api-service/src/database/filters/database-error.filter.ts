import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { DatabaseError } from 'pg';

@Catch(DatabaseError)
export class DatabaseErrorFilter implements ExceptionFilter {
  catch(exception: DatabaseError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    switch (exception.code) {
      case '23505':
        status = HttpStatus.CONFLICT;
        message = 'Duplicate entry';
        break;
    }

    response.status(status).json({
      statusCode: status,
      message: message,
    });
  }
}
