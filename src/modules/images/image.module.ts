import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UploadService } from './services/upload.service';
import { UploadController } from './controllers/upload.controller';
import { ImageRepository } from './repositories/image.repository';
import { ImageQueryRepository } from './repositories/image.query-repository';
import { ImageCommandService } from './services/image-command.service';
import { ImageOrmEntity } from './entities/image.orm-entity';
import { CustomerModule } from '../customers/customer.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ImageOrmEntity]),
    forwardRef(() => CustomerModule),
  ],
  controllers: [UploadController],
  providers: [UploadService, ImageRepository, ImageQueryRepository, ImageCommandService],
  exports: [UploadService, ImageRepository, ImageQueryRepository, ImageCommandService],
})
export class ImageModule {}