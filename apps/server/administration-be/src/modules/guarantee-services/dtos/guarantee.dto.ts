import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsUUID,
  IsEnum,
  IsDate,
  IsNumber,
  IsOptional,
  IsDateString,
} from 'class-validator';
import {
  Guarantee,
  GuaranteeStatusEnum,
  GuaranteeTypeEnum,
} from 'src/entities/guarantee.entity';

export class CreateGuaranteeDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;
  @ApiHideProperty()
  vendorId: string;
  @ApiHideProperty()
  vendorName: string;
  @ApiProperty()
  @IsDateString()
  @IsOptional()
  startDate: Date;
  @ApiProperty()
  @IsDateString()
  @IsOptional()
  endDate: Date;
  @ApiProperty()
  @IsEnum(GuaranteeTypeEnum)
  @IsNotEmpty()
  type: string;
  @ApiProperty()
  @IsNotEmpty()
  objectType: string;
  @ApiProperty()
  @IsOptional()
  @IsDateString()
  minValidityDate?: Date;
  @ApiProperty()
  @IsOptional()
  @IsDateString()
  guarantorValidityDate?: Date;
  @ApiProperty()
  @IsNotEmpty()
  title: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  objectId: string;
  @ApiProperty()
  @IsNumber()
  amount: number;
  @ApiProperty()
  @IsNotEmpty()
  currencyType: string;
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
  remark?: string;
  @ApiProperty()
  attachment: any;
  @ApiProperty({ default: GuaranteeStatusEnum.REQUESTED })
  @IsEnum(GuaranteeStatusEnum)
  status: string;
}

export class UpdateGuaranteeDto extends CreateGuaranteeDto {
  @ApiProperty()
  @IsUUID()
  id: string;
}

export class GuaranteeResponseDto extends UpdateGuaranteeDto {}
