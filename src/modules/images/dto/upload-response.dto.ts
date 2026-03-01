import { ApiProperty } from '@nestjs/swagger';

export class DeleteFileResponseDto {
  @ApiProperty({ description: 'Success status' })
  success: boolean;

  @ApiProperty({ description: 'Response message' })
  message: string;
}

export class UploadFilesDto {
  @ApiProperty({
    description: 'Upload multiple files',
    type: 'string',
    format: 'binary',
    isArray: true,
  })
  files: any[];
}