import { FppaVendor } from 'src/entities/fppa-vendor.entity';
import { CreateFppaVendorDto } from './create-fppa-vendor.dto';
import { UpdateFppaVendorDto } from './update-fppa-vendor.dto';

export class FppaVendorMapper {
  static toEntity(dto: CreateFppaVendorDto | UpdateFppaVendorDto): FppaVendor {
    const entity = new FppaVendor();
    if ('id' in dto) {
      entity.id = dto.id;
    }

    entity.accountName = dto.accountName;
    entity.accountNo = dto.accountNo;
    entity.businessType = dto.businessType;
    entity.mobileNumber = dto.mobileNumber;
    entity.tin = dto.tin;
    entity.supplierName = dto.supplierName;
    entity.supplierCode = dto.supplierCode;

    return entity;
  }
}
