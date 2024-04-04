import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { AdhocTeamMember } from 'src/entities';
import { MEMBER_TYPE_ENUM } from 'src/shared/enums/member-type.enum';

export class CreateAdhocTeamMemberDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  adhocTeamId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  organizationId: string;

  @ApiProperty({ enum: MEMBER_TYPE_ENUM })
  @IsEnum(MEMBER_TYPE_ENUM)
  type: string;

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

export class UpdateAdhocTeamMemberDto extends CreateAdhocTeamMemberDto {
  @ApiProperty()
  @IsString()
  id: string;
}

export class AdhocTeamMemberDto extends UpdateAdhocTeamMemberDto {}

export class BulkAdhocTeamMemberDto {
  @ApiProperty({ isArray: true, type: () => AdhocTeamMemberDto })
  @IsArray()
  members: AdhocTeamMemberDto[];

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  adhocTeamId: string;
}

export class AdhocTeamMemberResponseDto extends UpdateAdhocTeamMemberDto {
  static toDto(adhocTeamMember: AdhocTeamMember): AdhocTeamMemberResponseDto {
    const response = new AdhocTeamMemberResponseDto();

    response.id = adhocTeamMember.id;
    response.type = adhocTeamMember.type;
    response.userId = adhocTeamMember.userId;
    response.firstName = adhocTeamMember.user.account.firstName;
    response.lastName = adhocTeamMember.user.account.lastName;
    response.username = adhocTeamMember.user.account.username;

    return response;
  }

  static toDtos(
    adhocTeamMembers: AdhocTeamMember[],
  ): AdhocTeamMemberResponseDto[] {
    return adhocTeamMembers.map((adhocTeamMember) =>
      AdhocTeamMemberResponseDto.toDto(adhocTeamMember),
    );
  }
}
