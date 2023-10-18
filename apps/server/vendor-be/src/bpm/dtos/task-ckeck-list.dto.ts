import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';
export class CreateTaskCkeckListDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  description: string;
  @ApiProperty()
  isMandatory: string;
}

export class TaskCkeckListDto extends CreateTaskCkeckListDto {
  @ApiProperty()
  value: string;
}
