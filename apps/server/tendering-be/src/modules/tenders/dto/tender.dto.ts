import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateTenderDto {
  @ApiProperty()
  @IsUUID()
  prId: string;
}

export class ChangeTenderStatusDto {
  @ApiProperty()
  @IsUUID()
  id: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  status: string;
}

export class GenerateTenderDocumentDto {
  @ApiProperty()
  @IsUUID()
  id: string;
}
