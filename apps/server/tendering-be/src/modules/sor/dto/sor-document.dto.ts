import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateSorDocumentDto {
  @IsString()
  @IsUUID()
  @ApiProperty()
  itemId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  description: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  attachment: any;
}

export class UpdateSorDocumentDto extends CreateSorDocumentDto {
  @IsString()
  @IsUUID()
  @ApiProperty()
  id: string;
}

export class SorDocumentResponseDto extends UpdateSorDocumentDto {}
