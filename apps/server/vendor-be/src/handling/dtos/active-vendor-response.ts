import { ApiProperty } from '@nestjs/swagger';
import { WorkflowInstanceEntity } from '../entities/workflow-instance';

export class ActiveVendorsResponse {
  id: string;
  @ApiProperty()
  tin: string;
  @ApiProperty()
  userId: string;
  @ApiProperty()
  status: string;
  @ApiProperty()
  formOfEntity: string;
  @ApiProperty()
  country: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  district: string;
  @ApiProperty()
  origin: string;
  @ApiProperty()
  businessCategory: string;
  @ApiProperty()
  level: string;
  @ApiProperty()
  approvedOn: Date;
  @ApiProperty()
  expiryDate: Date;
  @ApiProperty()
  businessStatus: string;
  @ApiProperty()
  vendorId: string;
  static toResponse(entity: WorkflowInstanceEntity): ActiveVendorsResponse {
    const response = new ActiveVendorsResponse();
    if (entity.price) {
      response.businessCategory = entity.price.businessArea;
      if (entity.price.valueTo == -1 || entity.price.valueTo == 0)
        response.level =
          'Above' + entity.price.valueFrom + entity.price.currency;
      else
        response.level =
          entity.price.valueFrom +
          entity.price.currency +
          '-' +
          entity.price.valueTo +
          entity.price.currency;
    }

    // response.id = entity.id;
    response.tin = entity.vendor.tin;
    response.userId = entity.vendor.userId;
    response.country = entity.vendor.country;
    response.name = entity.vendor.name;
    response.status = entity.vendor.status;
    response.district = entity.vendor.district;
    response.name = entity.vendor.name;
    response.origin = entity.vendor.origin;
    response.vendorId = entity.vendor.id;
    response.id = entity.id;
    //response.expiryDate = new Date(entity.expireDate);
    //response.approvedOn = new Date(entity.approvedAt);
    response.status = entity.status;
    response.businessStatus = entity.businessStatus;

    return response;
  }
}
