import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { PermissionGeneratorService } from '../modules/permissions/services/permission-generator.service';

async function generatePermissions(): Promise<void> {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn', 'log'],
  });
  try {
    const generator = app.get(PermissionGeneratorService);
    const result = await generator.generateFromControllers();
    console.log('Permission generation completed.');
    console.log('Created:', result.created.length, result.created);
    console.log('Skipped (already exist):', result.skipped.length, result.skipped);
  } catch (err) {
    console.error('Permission generation failed:', err);
    process.exit(1);
  } finally {
    await app.close();
  }
}

generatePermissions();
