import { CustomerBussinesInfo } from '@entities';
import { CreateCustomerBussinesInfoDto } from './create-customer-bussines-info.dto';
import { UpdateCustomerBussinesInfoDto } from './update-customer-bussines-info.dto';

export class CustomerBusinessInfoMapper {
  static toEntity(
    dto: CreateCustomerBussinesInfoDto | UpdateCustomerBussinesInfoDto,
  ): CustomerBussinesInfo {
    const entity = new CustomerBussinesInfo();

    if ('id' in dto) {
      entity.id = dto.id;
    }

    entity.businessName = dto.businessLicenseNumber;
    entity.businessLicenseNumber = dto.businessLicenseNumber;
    entity.dateRegistered = dto.dateRegistered;
    entity.firstName = dto.firstName;
    entity.tin = dto.tin;
    entity.lastName = dto.lastName;
    entity.legalStatus = dto.legalStatus;

    entity.middleName = dto.middleName;
    entity.nationality = dto.nationality;
    entity.organizationName = dto.organizationName;

    return entity;
  }
}
