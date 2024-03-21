import { ApiProperty } from '@nestjs/swagger';
import { GuaranteeStatusEnum } from 'src/entities/guarantee.entity';
import { IsDate, IsEnum, IsOptional } from 'class-validator';

export class UpdateGuaranteeStatusDto {
  @ApiProperty({ enum: GuaranteeStatusEnum, enumName: 'GuaranteeStatusEnum' })
  @IsEnum(GuaranteeStatusEnum)
  status: GuaranteeStatusEnum;

  @ApiProperty({ required: false })
  remark?: string;

  @ApiProperty()
  @IsOptional()
  attachment: any;

  @ApiProperty({ required: false })
  @IsDate()
  minValidityDate?: Date;
}
