import {
  Controller,
  Post,
  Delete,
  Body,
  UploadedFiles,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiConsumes, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { UploadService } from '../services/upload.service';
import { ImageCommandService } from '../services/image-command.service';
import { DeleteFileResponseDto, UploadFilesDto } from '../dto/upload-response.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import type { CurrentUserPayload } from 'src/common/decorators/current-user.decorator';
import { File } from 'multer';
import { ImageOrmEntity } from '../entities/image.orm-entity';
import { ImageResponseDto } from '../dto/image-response.dto';

@ApiTags('Upload')
@Controller('upload')
export class UploadController {
  constructor(
    private readonly uploadService: UploadService,
    private readonly imageCommandService: ImageCommandService,
  ) {}

  @Post('files')
  @UseInterceptors(FilesInterceptor('files'))
  @ApiOperation({ summary: 'Upload multiple files' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Files to upload',
    type: UploadFilesDto,
  })
  @ApiBearerAuth('BearerAuth')
  @ApiResponse({ status: 200, description: 'Files uploaded successfully', type: [ImageResponseDto] })
  async uploadFiles(@UploadedFiles() files: File[], @CurrentUser() currentUser: CurrentUserPayload): Promise<ImageResponseDto[]> {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files provided');
    }

    const uploadedFiles = await this.uploadService.uploadFiles(files);
    let images: ImageResponseDto[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const uploadedFile = uploadedFiles[i];
      
      if (uploadedFile) {
        const imageRecord = await this.imageCommandService.createFromUpload([{
          originalname: file.originalname,
          fileName: file.originalname,
          filePath: '',
          key: uploadedFile.key,
          size: file.size,
          mimetype: file.mimetype,
          url: null
        }], {
          userId: currentUser.userId,
          merchantId: currentUser.merchantId,
        } as CurrentUserPayload);
        images.push(...imageRecord);
      }
    }

    return images;
  }

  @Post('files-v2')
  @UseInterceptors(FilesInterceptor('files'))
  @ApiOperation({ summary: 'Upload multiple files (v2 with URLs)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Files to upload',
    type: UploadFilesDto,
  })
  @ApiBearerAuth('BearerAuth')
  @ApiResponse({ status: 200, description: 'Files uploaded successfully', type: [ImageResponseDto] })
  async uploadFilesV2(@UploadedFiles() files: File[], @CurrentUser() currentUser: CurrentUserPayload): Promise<ImageResponseDto[]> {
      if (!files || files.length === 0) {
        throw new BadRequestException('No files provided');
    }

    const uploadedFiles = await this.uploadService.uploadFiles_v2(files);
    let images: ImageResponseDto[] = [];
    console.log('uploadedFiles', uploadedFiles);
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const uploadedFile = uploadedFiles.uploaded?.[i];
      console.log('uploadedFile', uploadedFile);
      
      if (uploadedFile) {
        const imageRecord = await this.imageCommandService.createFromUpload([{
          originalname: file.originalname,
          fileName: file.originalname,
          filePath: '',
          key: uploadedFile.key,
          size: file.size,
          mimetype: file.mimetype,
          url: uploadedFile.url
        }], {
          userId: currentUser.userId,
          merchantId: currentUser.merchantId,
        } as CurrentUserPayload);

        console.log('imageRecord', imageRecord);
        images.push(...imageRecord);
      }
    }

    console.log('images', images);

    return images;
  }

  @Delete('file')
  @ApiOperation({ summary: 'Delete file by key' })
  @ApiBearerAuth('BearerAuth')
  @ApiResponse({ status: 200, description: 'File deleted successfully' })
  async deleteFile(@Body() deleteDto: { key: string }) {
    if (!deleteDto.key) {
      throw new BadRequestException('File key is required');
    }

    return this.uploadService.deleteFile(deleteDto.key);
  }

  @Delete('file-v2')
  @ApiOperation({ summary: 'Delete file by key (v2 with better error handling)' })
  @ApiBearerAuth('BearerAuth')
  @ApiResponse({ status: 200, description: 'File deletion result', type: DeleteFileResponseDto })
  async deleteFileV2(@Body() deleteDto: { key: string }) {
    if (!deleteDto.key) {
      throw new BadRequestException('File key is required');
    }

    return this.uploadService.deleteFile_v2(deleteDto.key);
  }
}
