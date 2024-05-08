import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateTargetGroupDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  description: string;
}

export class UpdateTargetGroupDto extends CreateTargetGroupDto {
  @ApiProperty()
  @IsUUID()
  id: string;
}

export class TargetGroupResponseDto extends UpdateTargetGroupDto {}
