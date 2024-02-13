import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { InvoiceEntity } from 'src/entities';

export class MbrsData {
  @ApiProperty()
  id: string;
  @ApiProperty()
  tin: number;
  @ApiProperty()
  tenantId: string;
  @ApiProperty()
  businessLicenseNumber: number;
  @ApiProperty()
  nationality: string;
  @ApiProperty()
  legalStatus: string;
  @ApiProperty()
  businessName: string;
  @ApiProperty()
  dateRegistered: string;
  @ApiProperty()
  organizationName: string;
  @ApiProperty()
  firstName: string;
  @ApiProperty()
  middleName: string;
  @ApiProperty()
  lastName: string;
  @ApiProperty()
  createdAt: string;
  @ApiProperty()
  deletedAt: string;
  @ApiProperty()
  updatedAt: string;
  // static toResponse(entity: InvoiceEntity): MbrsDataResponse {
  //     const response = new InvoiceResponseDto();
  //     response.id = entity.id;
  //     response.InstanceId = entity.instanceId;
  //     response.applicationNo = entity.applicationNo;
  //     response.taskId = entity.taskId;
  //     response.taskName = entity.taskName;
  //     response.payToAccName = entity.payToAccName;
  //     response.payToAccNo = entity.payToAccNo;
  //     response.payToBank = entity.payToBank;
  //     response.payerAccountId = entity.userId;
  //     response.payerName = entity.payerName;
  //     response.createdOn = entity.createdOn;
  //     response.serviceName = entity.serviceName;
  //     response.paymentStatus = entity.paymentStatus;
  //     response.remark = entity.remark;

  //     return response;
  // }
}
export class MbrsDataDto {
  @ApiProperty()
  @IsNotEmpty()
  tin: string;
  @ApiProperty()
  @IsOptional()
  issuedDate?: string;
  @ApiProperty()
  @IsOptional()
  licenseNumber?: number;
}
export class FppaDataDto {
  @ApiProperty()
  @IsNotEmpty()
  id: string;
  @ApiProperty()
  tenantId: string;
  @ApiProperty()
  @IsNotEmpty()
  tin: number;
  @ApiProperty()
  @IsOptional()
  supplierCode: string;
  @ApiProperty()
  @IsOptional()
  supplierName: string;
  @ApiProperty()
  @IsOptional()
  businessType: string;
  @ApiProperty()
  @IsOptional()
  accountNo: string;
  @ApiProperty()
  @IsOptional()
  accountName: string;
  @ApiProperty()
  @IsOptional()
  mobileNumber: string;
  @ApiProperty()
  createdAt: string;
  @ApiProperty()
  deletedAt: string;
  @ApiProperty()
  updatedAt: string;
}
export class NCICDataDto {
  @ApiProperty()
  @IsNotEmpty()
  id: string;
  @ApiProperty()
  tenantId: string;
  @ApiProperty()
  tin: number;
  @ApiProperty()
  nameOfFirm: string;
  @ApiProperty()
  postalAddress: string;
  @ApiProperty()
  telephoneNumber: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  nationalOfFirm: string;
  @ApiProperty()
  typeOfRegistration: string;
  @ApiProperty()
  branch: string;
  @ApiProperty()
  category: string;
  @ApiProperty()
  district: string;
  @ApiProperty()
  region: string;
  @ApiProperty()
  createdAt: string;
  @ApiProperty()
  deletedAt: string;
  @ApiProperty()
  updatedAt: string;
}
