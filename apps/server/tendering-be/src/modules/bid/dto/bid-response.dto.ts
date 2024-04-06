import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsObject, IsString, IsUUID } from 'class-validator';
import { DocumentTypeEnum } from 'src/shared/enums';

export class CreateBidResponseDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  lotId: string;

  @ApiProperty({
    default: DocumentTypeEnum.RESPONSE,
    examples: [
      DocumentTypeEnum.FINANCIAL_RESPONSE,
      DocumentTypeEnum.TECHNICAL_RESPONSE,
      DocumentTypeEnum.RESPONSE,
    ],
  })
  @IsUUID()
  @IsNotEmpty()
  documentType: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  key: string;

  @ApiProperty()
  @IsObject()
  @IsNotEmpty()
  value: any;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class CreateBidResponseItemDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  lotId: string;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  itemId: string;

  @ApiProperty({
    default: DocumentTypeEnum.RESPONSE,
    examples: [
      DocumentTypeEnum.FINANCIAL_RESPONSE,
      DocumentTypeEnum.TECHNICAL_RESPONSE,
      DocumentTypeEnum.RESPONSE,
    ],
  })
  @IsUUID()
  @IsNotEmpty()
  documentType: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  key: string;

  @ApiProperty()
  @IsObject()
  @IsNotEmpty()
  value: any;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class CreateBidResponseTenderDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  tenderId: string;

  @ApiProperty({
    default: DocumentTypeEnum.RESPONSE,
    examples: [
      DocumentTypeEnum.FINANCIAL_RESPONSE,
      DocumentTypeEnum.TECHNICAL_RESPONSE,
      DocumentTypeEnum.RESPONSE,
    ],
  })
  @IsUUID()
  @IsNotEmpty()
  documentType: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  key: string;

  @ApiProperty()
  @IsObject()
  @IsNotEmpty()
  value: any;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class GetBidResponseDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  lotId: string;

  @ApiProperty({
    default: DocumentTypeEnum.RESPONSE,
    examples: [
      DocumentTypeEnum.FINANCIAL_RESPONSE,
      DocumentTypeEnum.TECHNICAL_RESPONSE,
      DocumentTypeEnum.RESPONSE,
    ],
  })
  @IsString()
  @IsNotEmpty()
  documentType: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  key: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class GetBidResponseTenderDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  tenderId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  key: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class CheckPasswordDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  tenderId: string;

  @ApiProperty({
    default: DocumentTypeEnum.RESPONSE,
    examples: [
      DocumentTypeEnum.FINANCIAL_RESPONSE,
      DocumentTypeEnum.TECHNICAL_RESPONSE,
      DocumentTypeEnum.RESPONSE,
    ],
  })
  @IsString()
  @IsNotEmpty()
  documentType: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;
}
