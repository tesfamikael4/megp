import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  MaxLength,
  IsOptional,
  IsEnum,
  IsUUID,
} from 'class-validator';
import { BidGuaranteeCancellationEnum } from 'src/shared/enums';

export class CreateBidGuaranteeCancellationDto {
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
    enum: BidGuaranteeCancellationEnum,
    default: BidGuaranteeCancellationEnum.REQUESTED,
  })
  @IsNotEmpty()
  @IsEnum(BidGuaranteeCancellationEnum)
  status: BidGuaranteeCancellationEnum;
}

export class UpdateBidGuaranteeCancellationDto extends CreateBidGuaranteeCancellationDto {
  @ApiProperty()
  @IsUUID()
  id: string;
}

export class BidGuaranteeCancellationResponseDto extends UpdateBidGuaranteeCancellationDto {}
