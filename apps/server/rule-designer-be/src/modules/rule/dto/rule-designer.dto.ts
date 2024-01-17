import { IsString, ValidateNested, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Rule } from 'src/entities';
import { CreateRuleDto } from './rule.dto';

export class CreateRuleDesignerDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({
    type: () => [CreateRuleDto],
    isArray: true,
    nullable: true,
    items: { type: 'array', items: { type: 'object' } },
  })
  @ValidateNested({ each: true })
  rules: Rule[];
}

export class UpdateRuleDesignerDto extends CreateRuleDesignerDto {
  @ApiProperty()
  @IsUUID()
  id: string;
}
