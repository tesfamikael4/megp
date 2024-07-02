import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
export class CreateReceivingAttachmentDto {
  @ApiProperty()
  @IsUUID()
  receivingNoteId: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  fileInfo: any;
}

export class UpdateReceivingAttachmentDto extends CreateReceivingAttachmentDto {
  @ApiProperty()
  @IsUUID()
  id: string;
}

export class ReceivingAttachmentResponseDto extends UpdateReceivingAttachmentDto {}
