import { IsArray, IsDate, IsNotEmpty, IsString } from 'class-validator';

export class MRAResponseDTO {
  @IsNotEmpty()
  @IsString()
  tin: string;

  @IsNotEmpty()
  @IsString()
  taxpayerName: string;

  @IsArray()
  @IsString({ each: true })
  tradingNames: string[];

  @IsNotEmpty()
  @IsString()
  postalAddress: string;

  @IsNotEmpty()
  @IsString()
  businessSectorISIC: string;

  @IsNotEmpty()
  @IsString()
  taxpayerSegment: string;

  @IsNotEmpty()
  registrationDate: string;
}
