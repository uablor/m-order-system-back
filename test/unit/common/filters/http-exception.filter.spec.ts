import {
  HttpException,
  HttpStatus,
  ArgumentsHost,
} from '@nestjs/common';
import { AllExceptionsFilter } from '../../../../src/common/filters/http-exception.filter';
import { LoggerService } from '../../../../src/common/logger/logger.service';

describe('AllExceptionsFilter', () => {
  let filter: AllExceptionsFilter;
  let loggerService: jest.Mocked<LoggerService>;

  const createMockHost = (correlationId?: string) => {
    const mockJson = jest.fn();
    const mockStatus = jest.fn().mockReturnValue({ json: mockJson });
    const mockResponse = { status: mockStatus };
    const mockRequest = {
      method: 'GET',
      url: '/test',
      correlationId,
    };

    return {
      host: {
        switchToHttp: jest.fn().mockReturnValue({
          getResponse: jest.fn().mockReturnValue(mockResponse),
          getRequest: jest.fn().mockReturnValue(mockRequest),
        }),
      } as unknown as ArgumentsHost,
      mockStatus,
      mockJson,
    };
  };

  beforeEach(() => {
    loggerService = {
      log: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
      verbose: jest.fn(),
    } as unknown as jest.Mocked<LoggerService>;

    filter = new AllExceptionsFilter(loggerService);
  });

  it('ควรจัดการ HttpException ได้ถูกต้อง', () => {
    const { host, mockStatus, mockJson } = createMockHost('corr-123');
    const exception = new HttpException('Bad Request', HttpStatus.BAD_REQUEST);

    filter.catch(exception, host);

    expect(mockStatus).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(mockJson).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: HttpStatus.BAD_REQUEST,
        correlationId: 'corr-123',
      }),
    );
    expect(loggerService.error).toHaveBeenCalled();
  });

  it('ควรจัดการ generic Error ได้ถูกต้อง', () => {
    const { host, mockStatus, mockJson } = createMockHost();
    const exception = new Error('Something went wrong');

    filter.catch(exception, host);

    expect(mockStatus).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(mockJson).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Something went wrong',
      }),
    );
  });

  it('ควรจัดการ unknown exception ได้ถูกต้อง', () => {
    const { host, mockStatus } = createMockHost();

    filter.catch('string error', host);

    expect(mockStatus).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
  });

  it('ควรจัดการ HttpException ที่มี object response ได้', () => {
    const { host, mockJson } = createMockHost();
    const exception = new HttpException(
      { message: 'Validation failed', errors: ['email required'] },
      HttpStatus.UNPROCESSABLE_ENTITY,
    );

    filter.catch(exception, host);

    expect(mockJson).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Validation failed',
        errors: ['email required'],
      }),
    );
  });
});
