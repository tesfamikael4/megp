import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsUUID,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { BidGuaranteeForefitStatusEnum } from 'src/shared/enums';

export class CreateBidGuaranteeForfeitDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  guaranteeId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  reason: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  remark?: string;

  @ApiProperty({
    enum: BidGuaranteeForefitStatusEnum,
    default: BidGuaranteeForefitStatusEnum.REQUESTED,
  })
  @IsEnum(BidGuaranteeForefitStatusEnum)
  @IsOptional()
  status: BidGuaranteeForefitStatusEnum;
}

export class UpdateBidGuaranteeForfeitDto extends CreateBidGuaranteeForfeitDto {
  @ApiProperty()
  @IsUUID()
  id: string;
}
export class BidGuaranteeForfeitResponseDto extends UpdateBidGuaranteeForfeitDto {}
