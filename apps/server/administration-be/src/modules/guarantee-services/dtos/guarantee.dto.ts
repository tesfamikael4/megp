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
import { GuaranteeStatusEnum } from 'src/shared/enums/guarantee-status.enum';
import { GuaranteeTypeEnum } from 'src/shared/enums/guarantee-type.enum';

export class CreateGuaranteeDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;
  @ApiHideProperty()
  vendorId: string;
  @ApiHideProperty()
  vendorName: string;
  @ApiProperty()
  @IsEnum(GuaranteeTypeEnum)
  @IsNotEmpty()
  type: string;
  @ApiProperty()
  @IsNotEmpty()
  objectType: string;
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
  attachment: any;
  @ApiProperty()
  @IsOptional()
  remark?: string;
}

export class UpdateGuaranteeDto extends CreateGuaranteeDto {
  @ApiProperty()
  @IsUUID()
  id: string;

  @ApiProperty({ default: GuaranteeStatusEnum.REQUESTED })
  @IsOptional()
  @IsEnum(GuaranteeStatusEnum)
  status: string;

  @ApiProperty()
  @IsDateString()
  @IsOptional()
  startDate: Date;

  @ApiProperty()
  @IsDateString()
  @IsOptional()
  endDate: Date;

  @ApiProperty()
  @IsOptional()
  @IsDate()
  minValidityDate?: Date;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  guarantorValidityDate?: Date;
}

export class GuaranteeResponseDto extends UpdateGuaranteeDto {}
