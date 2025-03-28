import {
  IsNotEmpty,
  IsOptional,
  IsUUID,
  IsDateString,
  IsString,
} from 'class-validator';

export class NCICResponseDTO {
  @IsNotEmpty()
  tenantId: number;

  @IsUUID()
  id: string;

  @IsNotEmpty()
  tin: string;

  @IsNotEmpty()
  nameOfFirm: string;

  @IsNotEmpty()
  postalAddress: string;

  @IsNotEmpty()
  telephoneNumber: string;

  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  nationalOfFirm: string;

  @IsNotEmpty()
  typeOfRegistration: string;

  @IsNotEmpty()
  branch: string;

  @IsNotEmpty()
  category: string;

  @IsNotEmpty()
  district: string;

  @IsNotEmpty()
  region: string;
}
