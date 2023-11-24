import { CreateNcicVendorDto } from './create-ncic-vendor.dto';
import { UpdateNcicVendorDto } from './update-ncic-vendor.dto';
import { NcicVendor } from 'src/entities/ncic-vendor.entity';

export class NcicVendorMapper {
  static toEntity(dto: CreateNcicVendorDto | UpdateNcicVendorDto): NcicVendor {
    const entity = new NcicVendor();
    if ('id' in dto) {
      entity.id = dto.id;
    }
    entity.branch = dto.branch;
    entity.category = dto.category;
    entity.postalAddress = dto.postalAddress;
    entity.district = dto.district;
    entity.tin = dto.tin;
    entity.email = dto.email;
    entity.nameOfFirm = dto.nameOfFirm;

    entity.nationalOfFirm = dto.nationalOfFirm;
    entity.region = dto.region;
    entity.telephoneNumber = dto.telephoneNumber;

    entity.typeOfRegistration = dto.typeOfRegistration;

    return entity;
  }
}
