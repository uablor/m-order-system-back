"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_SUCCESS_MESSAGE = exports.DEFAULT_SUCCESS_CODE = void 0;
exports.createResponse = createResponse;
exports.createSingleResponse = createSingleResponse;
exports.createPaginatedResponse = createPaginatedResponse;
exports.DEFAULT_SUCCESS_CODE = 200;
exports.DEFAULT_SUCCESS_MESSAGE = 'Success';
function createResponse(results, message = exports.DEFAULT_SUCCESS_MESSAGE, Code = exports.DEFAULT_SUCCESS_CODE) {
    return { success: true, Code, message, results };
}
function createSingleResponse(data, message = exports.DEFAULT_SUCCESS_MESSAGE, Code = exports.DEFAULT_SUCCESS_CODE) {
    return { success: true, Code, message, results: data };
}
function createPaginatedResponse(results, pagination, message = exports.DEFAULT_SUCCESS_MESSAGE, Code = exports.DEFAULT_SUCCESS_CODE) {
    return { success: true, Code, message, results, pagination };
}
//# sourceMappingURL=response.helper.js.map