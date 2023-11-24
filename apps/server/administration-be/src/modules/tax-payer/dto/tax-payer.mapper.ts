import { TaxPayer } from 'src/entities/tax-payer.entity';
import { CreateTaxPayerDto } from './create-tax-payer.dto';
import { UpdateTaxPayerDto } from './update-tax-payer.dto';

export class TaxPayerMapper {
  static toEntity(dto: CreateTaxPayerDto | UpdateTaxPayerDto): TaxPayer {
    const entity = new TaxPayer();
    if ('id' in dto) {
      entity.id = dto.id;
    }
    entity.tradingNames = dto.tradingNames;
    entity.businessSectorISIC = dto.businessSectorISIC;
    entity.postalAddress = dto.postalAddress;
    entity.registrationDate = dto.registrationDate;
    entity.tin = dto.tin;
    entity.taxpayerName = dto.taxpayerName;
    entity.taxpayerSegment = dto.taxpayerSegment;
    return entity;
  }
}
