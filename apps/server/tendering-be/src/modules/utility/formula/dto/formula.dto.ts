import { ApiProperty } from '@nestjs/swagger';
import { IsObject, IsOptional, IsString, IsUUID } from 'class-validator';
import { OrgAudit } from 'src/shared/entities';

export class CreateFormulaDto extends OrgAudit {
  @ApiProperty({
    description: 'Group name.',
  })
  @IsString()
  name: string;
}

export class UpdateFormulaDto {
  @ApiProperty({
    description: 'Group name.',
  })
  @IsString()
  name: string;
}

export class CreateFormulaUnitDto extends OrgAudit {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({
    description:
      'String representation of the formula. Using mathematical operators, variables, or referencing other formulas by name.',
  })
  @IsString()
  representation: string;

  @ApiProperty({
    type: 'string',
    format: 'uuid',
    description: 'UUID of the formula group to which this formula belongs.',
  })
  @IsUUID()
  groupId: string;
}

export class UpdateFormulaUnitDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({
    description:
      'String representation of the formula. Using mathematical operators, variables, or referencing other formulas by name.',
    example: 'x + y * 4',
  })
  @IsString()
  @IsOptional()
  representation: string;

  @ApiProperty({
    type: 'string',
    format: 'uuid',
    description: 'UUID of the formula group to which this formula belongs.',
  })
  @IsUUID()
  @IsOptional()
  groupId: string;
}

export class EvaluateFormulaUnitDto {
  @ApiProperty({
    description: 'Variables to be used in the evaluation of the formula.',
    format: 'object',
    example: { x: 1, y: 2, z: 3 },
  })
  @IsObject()
  variables: Record<string, number>;
}
