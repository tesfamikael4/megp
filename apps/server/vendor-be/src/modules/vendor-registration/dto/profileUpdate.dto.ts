import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ProfileInfoUpdate {
  // @ApiProperty()
  // @IsNotEmpty()
  id: string;
  @ApiProperty()
  @IsNotEmpty()
  profileData: any[];
  @ApiProperty()
  @IsNotEmpty()
  vendorId: string;
}
