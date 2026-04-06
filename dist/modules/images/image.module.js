"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const upload_service_1 = require("./services/upload.service");
const upload_controller_1 = require("./controllers/upload.controller");
const image_repository_1 = require("./repositories/image.repository");
const image_query_repository_1 = require("./repositories/image.query-repository");
const image_command_service_1 = require("./services/image-command.service");
const image_orm_entity_1 = require("./entities/image.orm-entity");
const customer_module_1 = require("../customers/customer.module");
let ImageModule = class ImageModule {
};
exports.ImageModule = ImageModule;
exports.ImageModule = ImageModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([image_orm_entity_1.ImageOrmEntity]),
            (0, common_1.forwardRef)(() => customer_module_1.CustomerModule),
        ],
        controllers: [upload_controller_1.UploadController],
        providers: [upload_service_1.UploadService, image_repository_1.ImageRepository, image_query_repository_1.ImageQueryRepository, image_command_service_1.ImageCommandService],
        exports: [upload_service_1.UploadService, image_repository_1.ImageRepository, image_query_repository_1.ImageQueryRepository, image_command_service_1.ImageCommandService],
    })
], ImageModule);
//# sourceMappingURL=image.module.js.map