import { IsString, ValidateNested, IsUUID, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class ConditionDto {
  @ApiProperty()
  @IsString()
  type: string;

  @ApiProperty()
  @IsString()
  field: string;

  @ApiProperty()
  @IsString()
  value: string;

  @ApiProperty()
  @IsString()
  joinType: string;

  @ApiProperty()
  @IsString()
  operator: string;
}

export class CreateRuleDto {
  @ApiProperty()
  @IsString()
  key: string;

  @ApiProperty()
  @IsNumber()
  executionOrder: number;

  @ApiProperty({
    type: () => [ConditionDto],
    isArray: true,
    items: { type: 'array', items: { type: 'object' } },
  })
  @ValidateNested({ each: true })
  conditions: ConditionDto[][];
}

export class UpdateRuleDto extends CreateRuleDto {
  @ApiProperty()
  @IsUUID()
  id: string;
}
