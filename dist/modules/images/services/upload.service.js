"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadService = void 0;
const common_1 = require("@nestjs/common");
const client_s3_1 = require("@aws-sdk/client-s3");
const uuid_1 = require("uuid");
const path = __importStar(require("path"));
let UploadService = class UploadService {
    s3;
    bucket;
    constructor() {
        this.bucket = process.env.R2_BUCKET_NAME || '';
        if (!this.bucket) {
            throw new Error('R2_BUCKET_NAME environment variable is required');
        }
        const endpoint = process.env.R2_ENDPOINT;
        const accessKeyId = process.env.R2_ACCESS_KEY_ID;
        const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
        if (!endpoint || !accessKeyId || !secretAccessKey) {
            throw new Error('R2_ENDPOINT, R2_ACCESS_KEY_ID, and R2_SECRET_ACCESS_KEY environment variables are required');
        }
        this.s3 = new client_s3_1.S3Client({
            region: 'auto',
            endpoint,
            credentials: {
                accessKeyId,
                secretAccessKey,
            },
        });
    }
    async uploadFiles(files) {
        const uploaded = [];
        for (const file of files) {
            const key = `laylaos/${(0, uuid_1.v4)()}${path.extname(file.originalname)}`;
            await this.s3.send(new client_s3_1.PutObjectCommand({
                Bucket: this.bucket,
                Key: key,
                Body: file.buffer,
                ContentType: file.mimetype,
            }));
            uploaded.push({ key });
        }
        return uploaded;
    }
    async deleteFile(key) {
        await this.s3.send(new client_s3_1.DeleteObjectCommand({
            Bucket: this.bucket,
            Key: key,
        }));
        return { message: 'Deleted successfully' };
    }
    async deleteFile_v2(key) {
        try {
            await this.s3.send(new client_s3_1.HeadObjectCommand({
                Bucket: this.bucket,
                Key: key,
            }));
            await this.s3.send(new client_s3_1.DeleteObjectCommand({
                Bucket: this.bucket,
                Key: key,
            }));
            return { success: true, message: '🗑️ File deleted successfully' };
        }
        catch (error) {
            if (error.name === 'NotFound' ||
                error.$metadata?.httpStatusCode === 404) {
                return { success: false, message: 'File does not exist' };
            }
            throw error;
        }
    }
    async uploadFiles_v2(files) {
        const uploaded = Array();
        for (const file of files) {
            const key = `laylaos/${(0, uuid_1.v4)()}${path.extname(file.originalname)}`;
            await this.s3.send(new client_s3_1.PutObjectCommand({
                Bucket: this.bucket,
                Key: key,
                Body: file.buffer,
                ContentType: file.mimetype,
            }));
            uploaded.push({
                name: file.originalname,
                key,
                url: `${process.env.R2_PUBLIC_URL}/${key}`,
            });
        }
        return { uploaded };
    }
};
exports.UploadService = UploadService;
exports.UploadService = UploadService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], UploadService);
//# sourceMappingURL=upload.service.js.map