import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateMessageTemplateDto {
  @ApiProperty()
  @IsNotEmpty()
  templateContent: string;
}
export class UpdateMessageTemplateDto extends CreateMessageTemplateDto {
  @ApiProperty()
  @IsNotEmpty()
  id: string;
}
export class MessageTemplateResponseDto extends UpdateMessageTemplateDto {}
