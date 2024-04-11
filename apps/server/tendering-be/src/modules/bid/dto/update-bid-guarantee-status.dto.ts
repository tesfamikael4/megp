import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsEnum, IsOptional } from 'class-validator';
import { BidGuaranteeStatusEnum } from 'src/shared/enums/bid-guarantee-status.enum';

export class UpdateGuaranteeStatusDto {
  @ApiProperty({
    enum: BidGuaranteeStatusEnum,
    enumName: 'BidGuaranteeStatusEnum',
  })
  @IsEnum(BidGuaranteeStatusEnum)
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
