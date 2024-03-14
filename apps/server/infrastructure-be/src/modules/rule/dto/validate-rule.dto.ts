import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsObject } from 'class-validator';

export class ValidateRuleDto {
  // @ApiProperty()
  // @IsObject()
  // params: any;
}

export class ValidateMultipleRuleDto {
  @ApiProperty()
  @IsObject()
  params: any;

  @ApiProperty()
  @IsArray()
  designerKeys: string[];
}
