import { Type } from 'class-transformer';
import {
  IsString,
  ArrayNotEmpty,
  ValidateNested,
  IsInt,
  IsBoolean,
  IsOptional,
} from 'class-validator';

export class ShareDTO {
  @IsString()
  name: string;

  @IsString()
  number_of_shares: string;
}

export class PartnerDTO {
  @IsString()
  id_number: string;

  @IsString()
  id_type: string;

  @IsString()
  name: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  nationality: string;

  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ShareDTO)
  shares: ShareDTO[];

  @IsString()
  @IsOptional()
  share: string;

  @IsOptional()
  type: string;
}

export class RecordDTO {
  branches: any;

  @IsString()
  business_name: string;

  @IsInt()
  id: number;

  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => PartnerDTO)
  partners: PartnerDTO[];

  @IsString()
  physical_address: string;

  @IsString()
  postal_address: string;

  @IsString()
  registration_date: string;

  @IsString()
  registration_number: string;

  @IsString()
  status: string;

  @IsString()
  tin: string;

  @IsBoolean()
  verified: boolean;
}

export class MBRSResponseDto {
  @IsInt()
  count: number;

  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => RecordDTO)
  records: RecordDTO[];
}
