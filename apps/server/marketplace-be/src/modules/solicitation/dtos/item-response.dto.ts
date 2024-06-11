import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { FileUploadDto } from 'megp-shared-be';

class DocumentResponseDto {
  @ApiProperty()
  @IsString()
  key: string;

  // @ApiProperty({ type: () => FileUploadDto })
  fileInfo: FileUploadDto;
}

export class CreateSolItemResponseDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  rfxItemId: string;

  @IsOptional()
  @IsUUID()
  vendorId: string;

  @ApiProperty({ type: () => DocumentResponseDto })
  value: DocumentResponseDto;
}

export class UpdateSolItemResponseDto extends CreateSolItemResponseDto {
  @ApiProperty()
  @IsUUID()
  id: string;
}
