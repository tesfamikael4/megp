import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class BidBookmarkResponseDto {
  id: string;
  tenderId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  external_organizations: any;
}

export class CreateBidBookmarkDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  tenderId: string;
}
