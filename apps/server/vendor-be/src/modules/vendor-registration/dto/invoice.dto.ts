import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { InvoiceEntity } from 'src/entities';

export class InvoiceResponseDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  businessAreaId: string;
  @ApiProperty()
  applicationNo: string;
  @ApiProperty()
  taskName: string;
  @ApiProperty()
  taskId: string;
  @ApiProperty()
  paymentDetail: any;
  @ApiProperty()
  payerName: string;
  @ApiProperty()
  payToAccNo: string;
  @ApiProperty()
  payToAccName: string;
  @ApiProperty()
  payToBank: string;
  @ApiProperty()
  amount: number;
  @ApiProperty()
  createdOn: Date;
  //Paid| Pending
  @ApiProperty()
  paymentStatus: string;
  @ApiProperty()
  pricingId: string;
  @ApiProperty()
  serviceId: string;
  @ApiProperty()
  remark: string;
  @ApiProperty()
  category: string;
  @ApiProperty()
  userId: string;
  attachmentUrl: string;
  @ApiProperty()
  refNumber: string;
  static toResponse(entity: InvoiceEntity): InvoiceResponseDto {
    const response = new InvoiceResponseDto();
    response.id = entity.id;
    response.userId = entity.userId;
    response.payToAccName = entity.payToAccName;
    response.payToAccNo = entity.payToAccNo;
    response.payToBank = entity.payToBank;
    response.payerName = entity.payerName;
    response.createdOn = entity.createdOn;
    response.paymentDetail = entity.paymentDetail;
    response.paymentStatus = entity.paymentStatus;
    response.remark = entity.remark;
    response.amount = entity.amount;
    response.serviceId = entity?.serviceId;
    response.paymentDetail = entity?.paymentDetail;
    response.attachmentUrl = entity.attachment;
    response.refNumber = entity.refNumber;
    return response;
  }
}
export class GenerateInvoice {
  @ApiProperty()
  @IsNotEmpty()
  priceRangeId: string;
  @ApiProperty()
  @IsNotEmpty()
  userInfo: any;
  @ApiProperty()
  @IsOptional()
  basic: any;
}
