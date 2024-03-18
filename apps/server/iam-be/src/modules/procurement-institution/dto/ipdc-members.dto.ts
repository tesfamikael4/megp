import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { MEMBER_TYPE_ENUM } from 'src/shared/enums/member-type.enum';

export class IPDCMemberDto {
  @ApiProperty({ enum: MEMBER_TYPE_ENUM })
  @IsEnum(MEMBER_TYPE_ENUM)
  type: string;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  userId: string;
}

export class CreateIPDCMemberDto extends IPDCMemberDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  ipdcId: string;
}

export class UpdateIPDCMemberDto extends CreateIPDCMemberDto {
  @ApiProperty()
  @IsString()
  id: string;
}

export class BulkIPDCMemberDto {
  @ApiProperty({ isArray: true, type: () => IPDCMemberDto })
  @IsArray()
  members: IPDCMemberDto[];

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  ipdcId: string;
}
