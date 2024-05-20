import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { ESolBookmarkStatus } from 'src/utils/enums/sol.enum';

export class CreateBookmarkDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  rfxId: string;

  @IsOptional()
  @IsUUID()
  vendorId: string;

  @IsOptional()
  status: ESolBookmarkStatus;
}

export class UpdateBookmarkDto extends CreateBookmarkDto {
  @ApiProperty()
  @IsUUID()
  id: string;
}
