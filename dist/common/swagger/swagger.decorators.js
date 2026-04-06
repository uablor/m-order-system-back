"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiOkResponseBase = ApiOkResponseBase;
exports.ApiCreatedResponseBase = ApiCreatedResponseBase;
exports.ApiBadRequestBase = ApiBadRequestBase;
exports.ApiUnauthorizedBase = ApiUnauthorizedBase;
exports.ApiForbiddenBase = ApiForbiddenBase;
exports.ApiNotFoundBase = ApiNotFoundBase;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const standardResponseSchema = {
    type: 'object',
    properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Operation completed' },
        data: {},
    },
};
function ApiOkResponseBase(type) {
    if (type) {
        return (0, common_1.applyDecorators)((0, swagger_1.ApiExtraModels)(type), (0, swagger_1.ApiOkResponse)({
            description: 'Request succeeded',
            schema: {
                allOf: [
                    {
                        properties: {
                            success: { type: 'boolean', example: true },
                            message: { type: 'string', example: 'OK' },
                            data: { $ref: (0, swagger_1.getSchemaPath)(type) },
                        },
                    },
                ],
            },
        }));
    }
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOkResponse)({
        description: 'Request succeeded',
        schema: standardResponseSchema,
    }));
}
function ApiCreatedResponseBase(type) {
    if (type) {
        return (0, common_1.applyDecorators)((0, swagger_1.ApiExtraModels)(type), (0, swagger_1.ApiCreatedResponse)({
            description: 'Resource created',
            schema: {
                allOf: [
                    {
                        properties: {
                            success: { type: 'boolean', example: true },
                            message: { type: 'string', example: 'Created' },
                            data: { $ref: (0, swagger_1.getSchemaPath)(type) },
                        },
                    },
                ],
            },
        }));
    }
    return (0, common_1.applyDecorators)((0, swagger_1.ApiCreatedResponse)({
        description: 'Resource created',
        schema: standardResponseSchema,
    }));
}
function ApiBadRequestBase() {
    return (0, swagger_1.ApiBadRequestResponse)({
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
function ApiUnauthorizedBase() {
    return (0, swagger_1.ApiUnauthorizedResponse)({
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
function ApiForbiddenBase() {
    return (0, swagger_1.ApiForbiddenResponse)({
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
function ApiNotFoundBase() {
    return (0, swagger_1.ApiNotFoundResponse)({
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
//# sourceMappingURL=swagger.decorators.js.map