import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class CreateEvalApprovalDto {
  @ApiProperty()
  @IsUUID()
  evalApproverId: string;

  version: number;
  isCurrent: boolean;
  isDone: boolean;
}

export class UpdateEvalApproverDto extends CreateEvalApprovalDto {
  @ApiProperty()
  @IsUUID()
  id: string;
}
