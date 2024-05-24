import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { ESolBookmarkStatus } from 'src/utils/enums/sol.enum';

export class CreateRegistrationDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  rfxId: string;

  vendorId: string;

  vendorName: string;

  salt: string;

  response: string;

  status: ESolBookmarkStatus;
}

export class UpdateRegistrationDto extends CreateRegistrationDto {
  @ApiProperty()
  @IsUUID()
  id: string;
}
