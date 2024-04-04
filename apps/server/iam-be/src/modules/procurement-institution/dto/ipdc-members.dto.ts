import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { IPDCMember, User } from 'src/entities';
import { MEMBER_TYPE_ENUM } from 'src/shared/enums/member-type.enum';

export class IPDCMemberDto {
  @ApiProperty({ enum: MEMBER_TYPE_ENUM })
  @IsEnum(MEMBER_TYPE_ENUM)
  type: string;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @ApiProperty()
  @IsUUID()
  @IsOptional()
  organizationId: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  organizationName: string;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  ipdcId: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  accountId: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  username: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  firstName: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  lastName: string;
}

export class CreateIPDCMemberDto extends IPDCMemberDto {}

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
export class IPDCMemberResponseDto extends UpdateIPDCMemberDto {
  static toDto(ipdcMember: IPDCMember): IPDCMemberResponseDto {
    const response = new IPDCMemberResponseDto();

    response.id = ipdcMember.id;
    response.type = ipdcMember.type;
    response.userId = ipdcMember.userId;
    response.firstName = ipdcMember.user.account.firstName;
    response.lastName = ipdcMember.user.account.lastName;
    response.username = ipdcMember.user.account.username;

    return response;
  }

  static toDtos(ipdcMembers: IPDCMember[]): IPDCMemberResponseDto[] {
    return ipdcMembers.map((ipdcMember) =>
      IPDCMemberResponseDto.toDto(ipdcMember),
    );
  }
}
