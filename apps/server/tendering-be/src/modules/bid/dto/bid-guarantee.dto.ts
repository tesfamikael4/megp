import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsUUID,
  IsEnum,
  IsNumber,
  IsOptional,
  IsDate,
} from 'class-validator';
import { BidGuaranteeStatusEnum } from 'src/shared/enums/bid-guarantee-status.enum';

export class UpdateGuaranteeStatusDto {
  @ApiProperty({
    enum: BidGuaranteeStatusEnum,
    enumName: 'BidGuaranteeStatusEnum',
  })
  @IsEnum(BidGuaranteeStatusEnum)
  @IsOptional()
  status: string;

  @ApiProperty()
  @IsOptional()
  remark?: string;

  @ApiProperty()
  @IsOptional()
  attachment: any;

  @ApiProperty()
  @IsOptional()
  @IsDate()
  minValidityDate?: Date;

  document: any;
}

export class CreateBidGuaranteeDto {
  @ApiHideProperty()
  lotId: string;

  @ApiHideProperty()
  bidderId: string;

  @ApiHideProperty()
  bidderName: string;

  @ApiHideProperty()
  organizationId: string;

  @ApiHideProperty()
  organizationName: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  contactPerson: any;

  @ApiProperty()
  @IsNumber()
  amount: number;

  @ApiProperty()
  @IsNotEmpty()
  currency: string;

  @ApiHideProperty()
  hashValue: string;

  @ApiProperty()
  @IsNotEmpty()
  guarantorId: string;

  @ApiProperty()
  @IsNotEmpty()
  guarantorBranchId: string;

  @ApiProperty()
  @IsNotEmpty()
  guarantorBranchName: string;

  @ApiProperty()
  @IsNotEmpty()
  guarantorName: string;

  @ApiProperty()
  @IsOptional()
  document: any;

  @ApiProperty()
  @IsOptional()
  referenceNumber?: string;

  @ApiProperty()
  @IsOptional()
  minValidityDate?: number;

  @ApiProperty()
  @IsOptional()
  revisedValidityDate?: number;
}

export class UpdateBidGuaranteeDto extends CreateBidGuaranteeDto {
  @ApiProperty()
  @IsUUID()
  id: string;
}

export class BidGuaranteeResponseDto extends UpdateBidGuaranteeDto {}
