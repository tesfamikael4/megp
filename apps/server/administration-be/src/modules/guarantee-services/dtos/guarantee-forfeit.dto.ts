import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID, IsEnum, IsOptional } from 'class-validator';
import { GuaranteeForefitStatusEnum } from 'src/shared/enums/guarantee-forefit.enum';

export class CreateGuaranteeForfeitDto {
  @ApiProperty()
  @IsNotEmpty()
  reason: string;

  @ApiProperty()
  @IsUUID()
  guaranteeId: string;
  @ApiProperty()
  @IsOptional()
  attachment: any;
  @ApiProperty({
    enum: GuaranteeForefitStatusEnum,
    default: GuaranteeForefitStatusEnum.REQUESTED,
  })
  @IsEnum(GuaranteeForefitStatusEnum)
  @IsOptional()
  status: string;
}

export class UpdateGuaranteeForfeitDto extends CreateGuaranteeForfeitDto {
  @ApiProperty()
  @IsUUID()
  id: string;
}
export class GuaranteeForfeitResponseDto extends UpdateGuaranteeForfeitDto {}
