import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsUUID,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { BidGuaranteeExtension } from 'src/entities/bid-guarantee-extension.entity';
import { BidGuaranteeExtensionEnum } from 'src/shared/enums';

export class CreateBidGuaranteeExtensionDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  guaranteeId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  reason: string;

  @ApiProperty()
  @IsNotEmpty()
  noOfDays: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  remark?: string;

  @ApiProperty({
    enum: BidGuaranteeExtensionEnum,
    default: BidGuaranteeExtensionEnum.INITIATED,
  })
  @IsNotEmpty()
  @IsEnum(BidGuaranteeExtensionEnum)
  status: BidGuaranteeExtensionEnum;
}

export class UpdateBidGuaranteeExtensionDto extends CreateBidGuaranteeExtensionDto {
  @ApiProperty()
  @IsUUID()
  id: string;
}

export class GuaranteeExtensionResponseDto extends UpdateBidGuaranteeExtensionDto {}
