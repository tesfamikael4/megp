import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateTenderNoticeDto {
  @ApiProperty()
  @IsNotEmpty()
  title: string;
}
export class UpdateTenderNoticeDto extends CreateTenderNoticeDto {
  @ApiProperty({
    format: 'uuid',
    required: true,
  })
  @IsUUID()
  id: string;
}
