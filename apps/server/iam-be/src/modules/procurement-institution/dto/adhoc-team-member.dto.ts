import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';
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
}

export class UpdateAdhocTeamMemberDto extends CreateAdhocTeamMemberDto {
  @ApiProperty()
  @IsString()
  id: string;
}

export class AdhocTeamMemberDto extends UpdateAdhocTeamMemberDto {}
