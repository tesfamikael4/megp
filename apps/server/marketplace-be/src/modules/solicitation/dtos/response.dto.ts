import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { FileUploadDto } from 'megp-shared-be';

export class CreateSolResponseDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  rfxId: string;

  @IsOptional()
  @IsUUID()
  vendorId: string;

  @IsOptional()
  @IsUUID()
  roundId: string;

  @ApiProperty({ type: () => [DocumentResponseDto] })
  @IsObject()
  @IsOptional()
  responses: DocumentResponseDto[];
}

class DocumentResponseDto {
  @ApiProperty()
  @IsString()
  rfxDocumentaryEvidenceId: string;

  @ApiProperty({ type: () => FileUploadDto })
  fileInfo: FileUploadDto;
}

export class UpdateSolResponseDto extends CreateSolResponseDto {
  @ApiProperty()
  @IsUUID()
  id: string;
}
