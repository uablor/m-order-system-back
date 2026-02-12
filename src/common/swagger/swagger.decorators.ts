import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
  ApiForbiddenResponse,
  getSchemaPath,
  ApiExtraModels,
} from '@nestjs/swagger';
const standardResponseSchema = {
  type: 'object',
  properties: {
    success: { type: 'boolean', example: true },
    message: { type: 'string', example: 'Operation completed' },
    data: {},
  },
};

/**
 * Standard 200 OK response.
 */
export function ApiOkResponseBase<TModel extends Type<unknown>>(type?: TModel) {
  if (type) {
    return applyDecorators(
      ApiExtraModels(type),
      ApiOkResponse({
        description: 'Request succeeded',
        schema: {
          allOf: [
            {
              properties: {
                success: { type: 'boolean', example: true },
                message: { type: 'string', example: 'OK' },
                data: { $ref: getSchemaPath(type) },
              },
            },
          ],
        },
      }),
    );
  }
  return applyDecorators(
    ApiOkResponse({
      description: 'Request succeeded',
      schema: standardResponseSchema,
    }),
  );
}

/**
 * Standard 201 Created response.
 */
export function ApiCreatedResponseBase<TModel extends Type<unknown>>(type?: TModel) {
  if (type) {
    return applyDecorators(
      ApiExtraModels(type),
      ApiCreatedResponse({
        description: 'Resource created',
        schema: {
          allOf: [
            {
              properties: {
                success: { type: 'boolean', example: true },
                message: { type: 'string', example: 'Created' },
                data: { $ref: getSchemaPath(type) },
              },
            },
          ],
        },
      }),
    );
  }
  return applyDecorators(
    ApiCreatedResponse({
      description: 'Resource created',
      schema: standardResponseSchema,
    }),
  );
}

/**
 * Standard 400 Bad Request response.
 */
export function ApiBadRequestBase() {
  return ApiBadRequestResponse({
    description: 'Validation error or bad request',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        message: { type: 'string', example: 'Validation failed' },
        data: {
          type: 'array',
          items: { type: 'object', properties: { property: { type: 'string' }, message: { type: 'string' } } },
        },
      },
    },
  });
}

/**
 * Standard 401 Unauthorized response.
 */
export function ApiUnauthorizedBase() {
  return ApiUnauthorizedResponse({
    description: 'Missing or invalid token',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        message: { type: 'string', example: 'Unauthorized' },
        data: { type: 'object', nullable: true },
      },
    },
  });
}

/**
 * Standard 403 Forbidden response.
 */
export function ApiForbiddenBase() {
  return ApiForbiddenResponse({
    description: 'Forbidden',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        message: { type: 'string', example: 'Forbidden' },
        data: { type: 'object', nullable: true },
      },
    },
  });
}

/**
 * Standard 404 Not Found response.
 */
export function ApiNotFoundBase() {
  return ApiNotFoundResponse({
    description: 'Resource not found',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        message: { type: 'string', example: 'Not found' },
        data: { type: 'object', nullable: true },
      },
    },
  });
}
