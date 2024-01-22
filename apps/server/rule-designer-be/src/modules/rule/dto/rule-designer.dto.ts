import { IsString, ValidateNested, IsUUID, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { EnforcementMethodEnum, Rule } from 'src/entities';
import { CreateRuleDto } from './rule.dto';

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
export class CreateRuleDesignerDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({
    enum: EnforcementMethodEnum,
  })
  @IsEnum(EnforcementMethodEnum)
  enforcementMethod: EnforcementMethodEnum;

  @ApiProperty()
  @IsString()
  key: string;

  @ApiProperty({
    type: () => CreateRuleDto,
    isArray: true,
    nullable: true,
    items: { type: 'array', items: { type: 'object' } },
  })
  @ValidateNested({ each: true })
  rules: Rule[];

  @ApiProperty({
    type: () => ActionDto,
    isArray: true,
    items: { type: 'array', items: { type: 'object' } },
  })
  @ValidateNested({ each: true })
  actions: ActionDto[];
}

export class UpdateRuleDesignerDto extends CreateRuleDesignerDto {
  @ApiProperty()
  @IsUUID()
  id: string;
}
