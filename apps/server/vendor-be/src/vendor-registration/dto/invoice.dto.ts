import { ApiProperty } from '@nestjs/swagger';
import { InvoiceEntity } from '../entities/invoice.entity';

export class InvoiceResponseDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  InstanceId: string;
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
  payerAccountId: string;
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
  remark: string;
  static toResponse(entity: InvoiceEntity): InvoiceResponseDto {
    const response = new InvoiceResponseDto();
    response.id = entity.id;
    response.InstanceId = entity.instanceId;
    response.applicationNo = entity.applicationNo;
    response.taskId = entity.taskId;
    response.taskName = entity.taskName;
    response.payToAccName = entity.payToAccName;
    response.payToAccNo = entity.payToAccNo;
    response.payToBank = entity.payToBank;
    response.payerAccountId = entity.payerAccountId;
    response.payerName = entity.payerName;
    response.createdOn = entity.createdOn;
    response.serviceName = entity.serviceName;
    response.paymentStatus = entity.paymentStatus;
    response.remark = entity.remark;
    return response;
  }
}
