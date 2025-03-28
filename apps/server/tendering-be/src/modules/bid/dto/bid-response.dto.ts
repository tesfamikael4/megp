import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsObject,
  IsString,
  IsUUID,
} from 'class-validator';
import { DocumentTypeEnum } from 'src/shared/enums';

export class CreateBidResponseDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  lotId: string;

  @ApiProperty({ default: DocumentTypeEnum.RESPONSE })
  @IsString()
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

class ItemValueDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  key: string;

  @ApiProperty()
  @IsArray()
  @IsNotEmpty()
  value: any[];
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

  @ApiProperty({ default: DocumentTypeEnum.RESPONSE })
  @IsString()
  @IsNotEmpty()
  documentType: string;

  @ApiProperty({ isArray: true, type: () => ItemValueDto })
  @IsArray()
  @IsNotEmpty()
  values: ItemValueDto[];

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

  @ApiProperty({ default: DocumentTypeEnum.RESPONSE })
  @IsString()
  @IsNotEmpty()
  documentType: string;

  @ApiProperty({
    default: 'Document',
  })
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

export class UploadBidResponseDocumentDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  lotId: string;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  bidFormId: string;

  @ApiProperty({ default: DocumentTypeEnum.RESPONSE })
  @IsString()
  @IsNotEmpty()
  documentType: string;

  @ApiProperty()
  @IsObject()
  @IsNotEmpty()
  value: any;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class UploadBidResponseDocumentaryEvidenceDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  lotId: string;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  eqcDocumentaryEvidenceId: string;

  @ApiProperty({ default: DocumentTypeEnum.RESPONSE })
  @IsString()
  @IsNotEmpty()
  documentType: string;

  @ApiProperty()
  @IsObject()
  @IsNotEmpty()
  value: any;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class BidResponseDocumentDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  lotId: string;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  bidFormId: string;

  @ApiProperty({ default: DocumentTypeEnum.RESPONSE })
  @IsString()
  @IsNotEmpty()
  documentType: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class BidResponseDocumentaryEvidenceDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  lotId: string;

  @ApiProperty({ default: DocumentTypeEnum.RESPONSE })
  @IsString()
  @IsNotEmpty()
  documentType: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class GetPresignedBidResponseDocumentaryEvidenceDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  id: string;

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

  @ApiProperty({ default: DocumentTypeEnum.RESPONSE })
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

export class GetBidResponseItemDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  lotId: string;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  itemId: string;

  @ApiProperty({ default: DocumentTypeEnum.RESPONSE })
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

  @ApiProperty({
    default: false,
  })
  @IsBoolean()
  @IsNotEmpty()
  isTree: boolean;
}

export class GetBidResponseTenderDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  tenderId: string;

  @ApiProperty({ default: DocumentTypeEnum.RESPONSE })
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

export class BidResponseItemDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  lotId: string;

  @ApiProperty({ default: DocumentTypeEnum.RESPONSE })
  @IsString()
  @IsNotEmpty()
  documentType: string;

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

  @ApiProperty({ default: DocumentTypeEnum.RESPONSE })
  @IsString()
  @IsNotEmpty()
  documentType: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class OpenBidResponseDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  tenderId: string;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  bidderId: string;

  @ApiProperty({ default: DocumentTypeEnum.RESPONSE })
  @IsString()
  @IsNotEmpty()
  documentType: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class OpenFinancialBidResponseDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  lotId: string;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  bidderId: string;

  @ApiProperty({ default: DocumentTypeEnum.RESPONSE })
  @IsString()
  @IsNotEmpty()
  documentType: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;
}
export class GenerateBidDeclarationDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  lotId: string;

  @ApiProperty({ default: DocumentTypeEnum.RESPONSE })
  @IsString()
  @IsNotEmpty()
  documentType: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;
}
