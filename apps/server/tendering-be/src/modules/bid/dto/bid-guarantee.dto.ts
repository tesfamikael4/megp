import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsUUID,
  IsEnum,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { BidGuaranteeTypeEnum } from 'src/shared/enums/bid-guarantee-type.enum';

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
  @IsEnum(BidGuaranteeTypeEnum)
  @IsNotEmpty()
  type: string;
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
