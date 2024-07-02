import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
export class CreatePOAttachmentDto {
  @ApiProperty()
  @IsUUID()
  purchaseOrderId: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  fileInfo: any;
}

export class UpdatePOAttachmentDto extends CreatePOAttachmentDto {
  @ApiProperty()
  @IsUUID()
  id: string;
}

export class POAttachmentResponseDto extends UpdatePOAttachmentDto {}
