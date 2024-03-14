import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { MEMBER_TYPE_ENUM } from 'src/shared/enums/member-type.enum';

export class CreateIPDCMemberDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  iPDCId: string;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  organizationId: string;

  @ApiProperty({ enum: MEMBER_TYPE_ENUM })
  @IsEnum(MEMBER_TYPE_ENUM)
  type: string;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  userId: string;
}

export class UpdateIPDCMemberDto extends CreateIPDCMemberDto {
  @ApiProperty()
  @IsString()
  id: string;
}

export class IPDCMemberDto extends UpdateIPDCMemberDto {}
