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
  serviceName: string;
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
  static toResponse(entity: InvoiceEntity): InvoiceResponseDto {
    const response = new InvoiceResponseDto();
    response.id = entity.id;
    response.businessAreaId = entity.businessAreaId;
    response.userId = entity.userId;
    response.businessAreaId = entity.businessAreaId;
    response.applicationNo = entity.applicationNo;
    response.payToAccName = entity.payToAccName;
    response.payToAccNo = entity.payToAccNo;
    response.payToBank = entity.payToBank;
    response.payerName = entity.payerName;
    response.createdOn = entity.createdOn;
    response.serviceName = entity.serviceName;
    response.paymentStatus = entity.paymentStatus;
    response.remark = entity.remark;
    response.amount = entity.amount;
    response.serviceId = entity?.businessArea?.serviceId;
    response.pricingId = entity?.businessArea?.priceRangeId;
    response.category = entity?.businessArea?.category;
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
