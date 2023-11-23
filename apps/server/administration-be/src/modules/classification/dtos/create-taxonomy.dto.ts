import { ApiProperty } from '@nestjs/swagger';
import { CreateClassificationDto } from './create-classfication.dto';
import { IsArray, IsObject, IsString } from 'class-validator';

class ExcelDtaDto {
  @ApiProperty({
    isArray: true,
    type: () => CreateClassificationDto,
  })
  @IsArray()
  segments: CreateClassificationDto[];

  @ApiProperty({
    isArray: true,
    type: () => CreateClassificationDto,
  })
  @IsArray()
  families: CreateClassificationDto[];

  @ApiProperty({
    isArray: true,
    type: () => CreateClassificationDto,
  })
  @IsArray()
  classes: CreateClassificationDto[];

  @ApiProperty({
    isArray: true,
    type: () => CreateClassificationDto,
  })
  @IsArray()
  commodities: CreateClassificationDto[];
}

export class CreateTaxonomyCodeSetDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  version: string;

  @ApiProperty({
    description: 'Excel data segregated by types',
    isArray: false,
    type: () => ExcelDtaDto,
  })
  @IsObject()
  excelData: ExcelDtaDto;
}
