import { ApiProperty } from '@nestjs/swagger';
import {
  BusinessAreaEntity,
  IsrVendorsEntity,
  WorkflowInstanceEntity,
} from 'src/entities';
import { BusinessAreaDetailResponseDto } from './business-area.dto';

export class IsrVendorsListResponseDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  tinNumber: string;
  @ApiProperty()
  status: string;
  @ApiProperty()
  basic: any;
  @ApiProperty()
  address: any;
  @ApiProperty()
  static toResponse(entity: IsrVendorsEntity) {
    //    let isrvendor = new IsrVendorsResponseDto();
    const { tenantId, createdAt, userId, initial, ...isrvendor } = {
      ...entity,
    };
    return isrvendor;
  }
}

export class IsrVendorsResponseDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  tinNumber: string;
  @ApiProperty()
  status: string;
  @ApiProperty()
  basic: any;
  @ApiProperty()
  address: any;
  @ApiProperty()
  contactPersons: any;
  @ApiProperty()
  businessSizeAndOwnership: any;
  // @ApiProperty()
  // shareHolders: any;
  @ApiProperty()
  beneficialOwnershipShareholders: any;
  @ApiProperty()
  bankAccountDetails: any;
  @ApiProperty()
  areasOfBusinessInterest: any;
  @ApiProperty()
  invoice: any;
  @ApiProperty()
  supportingDocuments: any;
  @ApiProperty()
  paymentReceipt: any;
  @ApiProperty()
  remark: string;
  @ApiProperty()
  instances: WorkflowInstanceEntity[];
  @ApiProperty()
  businessAreas: BusinessAreaEntity[];

  static toResponse(entity: IsrVendorsEntity) {
    const { tenantId, updatedAt, createdAt, userId, initial, ...rest } = entity;
    const accounts = rest.bankAccountDetails.map((b) => {
      const { bankId, ...bank } = b;
      return bank;
    });

    rest.bankAccountDetails = accounts;

    return rest;
  }
}
export class IsrVendorDetailResponseDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  tinNumber: string;
  @ApiProperty()
  status: string;
  @ApiProperty()
  basic: any;
  @ApiProperty()
  address: any;
  @ApiProperty()
  contactPersons: any;
  @ApiProperty()
  businessSizeAndOwnership: any;
  @ApiProperty()
  shareHolders: any;
  @ApiProperty()
  beneficialOwnership: any;
  @ApiProperty()
  bankAccountDetails: any;
  @ApiProperty()
  areasOfBusinessInterest: any;
  @ApiProperty()
  invoice: any;
  @ApiProperty()
  supportingDocuments: any;
  @ApiProperty()
  paymentReceipt: any;
  @ApiProperty()
  remark: string;
  @ApiProperty()
  instances: WorkflowInstanceEntity[];
  @ApiProperty()
  businessAreas: BusinessAreaDetailResponseDto[];
}
export class NotifyIam {
  @ApiProperty()
  email: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  queueName: string;
  @ApiProperty()
  eventName: string;
}
