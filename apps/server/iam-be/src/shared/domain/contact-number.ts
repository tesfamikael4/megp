import { ApiProperty } from '@nestjs/swagger';

export class ContactNumber {
  @ApiProperty()
  code: string;
  @ApiProperty()
  number: string;
}
