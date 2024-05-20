import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { ESolBookmarkStatus } from 'src/utils/enums/sol.enum';

export class CreateRegistrationDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  rfxId: string;

  @IsOptional()
  @IsUUID()
  vendorId: string;

  @IsOptional()
  vendorName: string;

  @IsOptional()
  salt: string;

  @IsOptional()
  response: string;

  @IsOptional()
  status: ESolBookmarkStatus;
}

export class UpdateRegistrationDto extends CreateRegistrationDto {
  @ApiProperty()
  @IsUUID()
  id: string;
}
