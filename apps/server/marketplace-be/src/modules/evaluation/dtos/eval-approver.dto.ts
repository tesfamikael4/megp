import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsUUID } from 'class-validator';

export class CreateEvalApproverDto {
  @ApiProperty()
  @IsUUID()
  rfxId: string;

  @ApiProperty({ type: 'boolean', default: false })
  @IsBoolean()
  evaluatorId: boolean;

  @ApiProperty({ type: 'boolean', default: false })
  @IsBoolean()
  evaluatorName: boolean;

  @ApiProperty()
  @IsNumber()
  order: number;

  organizationId: boolean;
}

export class UpdateEvalApproverDto extends CreateEvalApproverDto {
  @ApiProperty()
  @IsUUID()
  id: string;
}
