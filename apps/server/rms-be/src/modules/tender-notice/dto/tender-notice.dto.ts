import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { ETenderNoticeType } from 'src/utils/enums/tender-notice.enum';

export class CreateTenderNoticeDto {
  @ApiProperty()
  @IsNotEmpty()
  objectId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(ETenderNoticeType)
  object: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  procurementCategory: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  procurementReferenceNumber: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  budgetCode: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  prId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsObject()
  metadata: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  organizationId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  organizationName: string;

  @ApiProperty()
  @IsNotEmpty()
  publishmentDate: string;

  @ApiProperty()
  @IsNotEmpty()
  closingDate: string;
}

export class UpdateTenderNoticeDto extends CreateTenderNoticeDto {
  @ApiProperty({
    format: 'uuid',
    required: true,
  })
  @IsUUID()
  id: string;
}
