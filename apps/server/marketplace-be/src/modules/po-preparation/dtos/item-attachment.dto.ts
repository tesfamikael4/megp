import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
export class CreateItemAttachmentDto {
  @ApiProperty()
  @IsUUID()
  itemId: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  fileInfo: any;
}

export class UpdateItemAttachmentDto extends CreateItemAttachmentDto {
  @ApiProperty()
  @IsUUID()
  id: string;
}

export class ItemAttachmentResponseDto extends UpdateItemAttachmentDto {}
