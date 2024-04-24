import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class CreateNotificationDto {
  @ApiProperty()
  @IsNotEmpty()
  userId: string;
  @ApiProperty()
  @IsNotEmpty()
  title: string;
  @ApiProperty()
  @IsNotEmpty()
  content: string;
  @ApiProperty()
  @IsOptional()
  status: string;
}
export class UpdateNotificationDto extends CreateNotificationDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  id: string;
}
export class NotificationResponseDto extends UpdateNotificationDto {
  @ApiProperty()
  status: string;
}
