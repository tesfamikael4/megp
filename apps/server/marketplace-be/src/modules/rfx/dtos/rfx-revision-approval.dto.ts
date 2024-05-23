import { IsUUID, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ERfxRevisionApprovalStatusEnum } from 'src/utils/enums';

export class CreateRevisionApprovalDto {
  @ApiProperty()
  @IsUUID()
  rfxId: string;

  @ApiProperty()
  @IsEnum(ERfxRevisionApprovalStatusEnum)
  status: ERfxRevisionApprovalStatusEnum;
}

export class UpdateRevisionApprovalDto extends CreateRevisionApprovalDto {
  @ApiProperty()
  @IsUUID()
  id: true;
}
