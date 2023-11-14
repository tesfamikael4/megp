import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';
export class CreateTaskCheckListDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  description: string;
  @ApiProperty()
  isMandatory: string;
}

export class TaskCheckListDto extends CreateTaskCheckListDto {
  @ApiProperty()
  value: string;
}
