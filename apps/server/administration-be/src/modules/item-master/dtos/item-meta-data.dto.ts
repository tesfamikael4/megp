import { ApiProperty } from '@nestjs/swagger';

export class CreateItemMetaDataDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  code: string;
}

export class UpdateItemMetaDataDto extends CreateItemMetaDataDto {
  @ApiProperty()
  id: string;
}
