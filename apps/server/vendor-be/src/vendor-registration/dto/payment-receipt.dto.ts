import { ApiProperty } from '@nestjs/swagger';
import { PaymentReceiptEntity } from '../../handling/entities/receipt-attachment';
import { CreateFileDto } from './file.dto';

export class PaymentReceiptDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  invoiceId: string;
  @ApiProperty()
  referenceNumber: string;
  @ApiProperty()
  remark: string;
  @ApiProperty()
  file: CreateFileDto;
  static fromDto(dto: PaymentReceiptDto): PaymentReceiptEntity {
    const entity = new PaymentReceiptEntity();
    if (!dto) {
      return;
    }
    entity.invoiceId = dto.invoiceId;
    entity.referenceNumber = dto.referenceNumber;
    return entity;
  }
}

export class PaymentReceiptResponseDto extends PaymentReceiptDto {
  @ApiProperty()
  filePath: string;
  @ApiProperty()
  fileName: string;
  @ApiProperty()
  fileType: string;
  static toResponse(entity: PaymentReceiptEntity): PaymentReceiptResponseDto {
    const response = new PaymentReceiptResponseDto();
    response.id = entity.id;
    response.invoiceId = entity.invoiceId;
    response.referenceNumber = entity.referenceNumber;
    response.remark = entity.remark;
    response.filePath = entity.filePath;
    response.fileType = entity.fileType;
    return response;
  }
}
