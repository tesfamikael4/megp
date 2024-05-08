import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsUUID,
  IsEnum,
  IsString,
  MaxLength,
  IsOptional,
} from 'class-validator';
import { BidGuaranteeRelease } from 'src/entities/bid-guarantee-release.entity';
import { BidGuaranteeReleaseEnum } from 'src/shared/enums';

export class CreateBidGuaranteeReleaseDto {
  @ApiProperty()
  @IsUUID()
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
    enum: BidGuaranteeReleaseEnum,
    default: BidGuaranteeReleaseEnum.REQUESTED,
  })
  @IsEnum(BidGuaranteeReleaseEnum)
  status: BidGuaranteeReleaseEnum;
}

export class UpdateBidGuaranteeReleaseDto extends CreateBidGuaranteeReleaseDto {
  @ApiProperty()
  @IsUUID()
  id: string;
}

export class BidGuaranteeReleaseResponseDto extends UpdateBidGuaranteeReleaseDto {}
