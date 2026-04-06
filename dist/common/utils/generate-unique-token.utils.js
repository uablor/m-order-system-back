"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateUniqueToken = generateUniqueToken;
const crypto_1 = require("crypto");
function generateUniqueToken() {
    return (0, crypto_1.randomBytes)(24).toString('base64url');
}
//# sourceMappingURL=generate-unique-token.utils.js.map