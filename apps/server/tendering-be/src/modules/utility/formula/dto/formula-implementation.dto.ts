import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
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

export class CreateFormulaImplementationDto extends OrgAudit {
  @ApiProperty()
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({
    description:
      'String representation of the formula. Using mathematical operators, variables, or referencing other formulas by name.',
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
  lotId: string;

  @IsUUID()
  itemId: string;

  @IsUUID()
  bidderId: string;
}

export class CreateUnitPriceDto {
  @IsUUID()
  lotId: string;

  @IsUUID()
  itemId: string;

  @IsUUID()
  bidderId: string;
}

export class UpdateFormulaImplementationDto {
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
  lotId: string;

  @IsNumber()
  result: number;
}

export class EvaluateFormulaImplementationDto {
  @ApiProperty({
    description: 'Variables to be used in the evaluation of the formula.',
    format: 'object',
    example: { x: 1, y: 2, z: 3 },
  })
  @IsObject()
  variables: Record<string, number>;
}
