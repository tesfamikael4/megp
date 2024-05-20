import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsUUID } from 'class-validator';
import { ESolBookmarkStatus } from 'src/utils/enums/sol.enum';

export class CreateOfferDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  rfxItemId: string;

  @ApiProperty()
  @IsUUID()
  roundId: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  price: number;

  @IsOptional()
  vendorId: string;
}

export class UpdateOferDto extends CreateOfferDto {
  @ApiProperty()
  @IsUUID()
  id: string;
}
