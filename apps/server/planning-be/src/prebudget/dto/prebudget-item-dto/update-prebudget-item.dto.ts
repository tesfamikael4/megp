import { ApiProperty } from '@nestjs/swagger';
import { CreatePrebudgetPlanItemDto } from './creat-prebudget-item.dto';
import { IsUUID } from 'class-validator';
import { PrebudgetPlanItem } from '../../entities/prebudget-item.entity';

export class UpdatePrebudgetPlanItemDto extends CreatePrebudgetPlanItemDto {
  @ApiProperty()
  @IsUUID()
  id: string;

  static fromDto(dto: UpdatePrebudgetPlanItemDto): PrebudgetPlanItem {
    const entity = new PrebudgetPlanItem();
    entity.id = dto.id;
    entity.prebudgetId = dto.prebudgetId;
    entity.fundingSource = dto.fundingSource;
    entity.donorId = dto.donorId;
    entity.frameworkContract = dto.frameworkContract;
    entity.donorName = dto.donorName;
    entity.procurementCategoryId = dto.procurementCategoryId;
    entity.procurementCategory = dto.procurementCategory;
    entity.procurementMethodId = dto.procurementMethodId;
    entity.procurementMethod = dto.procurementMethod;
    entity.procurementStatus = dto.procurementStatus;
    entity.indigenousPreference = dto.indigenousPreference;
    entity.MSME = dto.MSME;
    entity.marginalizedGroups = dto.marginalizedGroups;
    entity.itemCodeReferenceType = dto.itemCodeReferenceType;
    entity.itemCode = dto.itemCode;
    entity.itemCodeDescription = dto.itemCodeDescription;
    entity.currency = dto.currency;
    entity.price = dto.price;
    entity.uOM = dto.uOM;
    entity.uOMId = dto.uOMId;
    entity.quantity = dto.quantity;
    entity.frameworkContract = dto.frameworkContract;
    return entity;
  }

  static toDto(entity: PrebudgetPlanItem): UpdatePrebudgetPlanItemDto {
    const dto = new UpdatePrebudgetPlanItemDto();
    dto.id = entity.id;
    dto.prebudgetId = entity.prebudgetId;
    dto.fundingSource = entity.fundingSource;
    dto.donorId = entity.donorId;
    dto.frameworkContract = entity.frameworkContract;
    dto.donorName = entity.donorName;
    dto.procurementCategoryId = entity.procurementCategoryId;
    dto.procurementCategory = entity.procurementCategory;
    dto.procurementMethodId = entity.procurementMethodId;
    dto.procurementMethod = entity.procurementMethod;
    dto.procurementStatus = entity.procurementStatus;
    dto.indigenousPreference = entity.indigenousPreference;
    dto.MSME = entity.MSME;
    dto.marginalizedGroups = entity.marginalizedGroups;
    dto.itemCodeReferenceType = entity.itemCodeReferenceType;
    dto.itemCode = entity.itemCode;
    dto.itemCodeDescription = entity.itemCodeDescription;
    dto.currency = entity.currency;
    dto.price = entity.price;
    dto.uOM = entity.uOM;
    dto.uOMId = entity.uOMId;
    dto.quantity = entity.quantity;
    dto.frameworkContract = entity.frameworkContract;
    return dto;
  }
  static toDtos(items: PrebudgetPlanItem[]) {
    return items?.map((item) => this.toDto(item));
  }
}
