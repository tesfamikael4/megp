import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import { FileResponseDto } from 'src/shared/domain';
export class CreateDocumentDto {
  @ApiProperty({ type: () => FileResponseDto })
  fileInfo: FileResponseDto;
}

export class UpdateDocumentDto extends CreateDocumentDto {
  @ApiProperty()
  @IsUUID()
  id: string;
}

export class DocumentResponseDto extends UpdateDocumentDto {}
