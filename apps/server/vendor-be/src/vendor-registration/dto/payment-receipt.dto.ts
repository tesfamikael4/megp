import { ApiProperty } from '@nestjs/swagger';
import { PaymentReceiptEntity } from '../../bpm/workflow-instances/entities/receipt-attachment';

export class PaymentReceiptDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  InvoiceId: string;
  @ApiProperty()
  referenceNumber: string;
  @ApiProperty()
  remark: string;
  static fromDto(dto: PaymentReceiptDto): PaymentReceiptEntity {
    const entity = new PaymentReceiptEntity();
    if (!dto) {
      return;
    }
    entity.invoiceId = dto.InvoiceId;
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
    response.InvoiceId = entity.invoiceId;
    response.referenceNumber = entity.referenceNumber;
    response.remark = entity.remark;
    response.filePath = entity.filePath;
    response.fileType = entity.fileType;
    return response;
  }
}
