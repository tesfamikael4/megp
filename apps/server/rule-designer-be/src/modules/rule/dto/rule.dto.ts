import { IsString, IsArray, ValidateNested, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
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

class ActionDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  value: string | string[];

  @ApiProperty()
  @IsString()
  type: string;
}

export class CreateRuleDto {
  @ApiProperty()
  @IsString()
  rule: string;

  @ApiProperty({
    type: () => [ConditionDto],
    isArray: true,
    items: { type: 'array', items: { type: 'object' } },
  })
  @ValidateNested({ each: true })
  conditions: ConditionDto[][];

  @ApiProperty({
    type: () => ActionDto,
    isArray: true,
    items: { type: 'array', items: { type: 'object' } },
  })
  @ValidateNested({ each: true })
  actions: ActionDto[];
}

export class UpdateRuleDto extends CreateRuleDto {
  @ApiProperty()
  @IsUUID()
  id: string;
}
