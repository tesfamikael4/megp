import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateIPDCDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  procurementInstitutionId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  status: string;

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  startDate: Date;

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  endDate: Date;
}

export class UpdateIPDCDto extends CreateIPDCDto {
  @ApiProperty()
  @IsString()
  id: string;
}

export class IPDCDto extends UpdateIPDCDto {}
