import { IsUUID, IsOptional, IsInt, IsEnum, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { EWorkflowItemAction } from '../enums/workflow-item.enum';

export class CreateWorkflowItemDetailDto {
  @ApiProperty()
  @IsUUID()
  itemId: string;

  @ApiProperty()
  @ApiProperty()
  @IsEnum(EWorkflowItemAction)
  status: EWorkflowItemAction;

  @ApiProperty()
  @IsString()
  @IsOptional()
  remark?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  objectId?: string; // parent id

  @ApiProperty()
  @IsInt()
  @IsOptional()
  step?: number;
}

export class UpdateWorkflowItemDetailDto extends CreateWorkflowItemDetailDto {
  @ApiProperty()
  @IsUUID()
  id: string;
}
