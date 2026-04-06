"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("../app/app.module");
const permission_generator_service_1 = require("../modules/permissions/services/permission-generator.service");
async function generatePermissions() {
    const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule, {
        logger: ['error', 'warn', 'log'],
    });
    try {
        const generator = app.get(permission_generator_service_1.PermissionGeneratorService);
        const result = await generator.generateFromControllers();
        console.log('Permission generation completed.');
        console.log('Created:', result.created.length, result.created);
        console.log('Skipped (already exist):', result.skipped.length, result.skipped);
    }
    catch (err) {
        console.error('Permission generation failed:', err);
        process.exit(1);
    }
    finally {
        await app.close();
    }
}
generatePermissions();
//# sourceMappingURL=generate-permissions.js.map