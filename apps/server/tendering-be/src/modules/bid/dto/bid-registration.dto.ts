import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsString,
  IsUUID,
  ValidateIf,
} from 'class-validator';
import { EnvelopTypeEnum } from 'src/shared/enums';

export class CreateBidRegistrationDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  tenderId: string;

  @ApiProperty({
    default: EnvelopTypeEnum.SINGLE_ENVELOP,
    enum: EnvelopTypeEnum,
  })
  @IsEnum(EnvelopTypeEnum)
  @IsNotEmpty()
  envelopType: EnvelopTypeEnum;

  @ValidateIf((obj) => obj.envelopType == EnvelopTypeEnum.SINGLE_ENVELOP)
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;

  @ValidateIf((obj) => obj.envelopType == EnvelopTypeEnum.TWO_ENVELOP)
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  financialPassword: string;

  @ValidateIf((obj) => obj.envelopType == EnvelopTypeEnum.TWO_ENVELOP)
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  technicalPassword: string;
}

export class CreateBidRegistrationStatusDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  lotId: string;
}
