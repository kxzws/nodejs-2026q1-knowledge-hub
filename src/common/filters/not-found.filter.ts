import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(NotFoundException)
export class NotFoundExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('NotFound');

  catch(exception: NotFoundException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();

    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = exception.getStatus();

    this.logger.warn(`404: Route ${request.url} not found`);

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: 'Oops! There is nothing by this route.',
      suggestion: 'Check if URL is valid or see docs',
    });
  }
}
