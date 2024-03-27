import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsEnum, IsOptional } from 'class-validator';
import { GuaranteeStatusEnum } from 'src/shared/enums/guarantee-status.enum';

export class UpdateGuaranteeStatusDto {
  @ApiProperty({ enum: GuaranteeStatusEnum, enumName: 'GuaranteeStatusEnum' })
  @IsEnum(GuaranteeStatusEnum)
  @IsOptional()
  status: string;

  @ApiProperty()
  @IsOptional()
  remark?: string;

  @ApiProperty()
  @IsOptional()
  attachment: any;

  @ApiProperty()
  @IsOptional()
  @IsDate()
  minValidityDate?: Date;
}
