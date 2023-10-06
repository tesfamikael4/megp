import { ApiProperty } from '@nestjs/swagger';
import {
  Currency,
  FundingSource,
  ItemCodeReferenceType,
  ProcurementStatus,
} from '../../../shared/enums/enums';
import {
  IsDefined,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { PrebudgetPlanItem } from '../../entities/prebudget-item.entity';
import {
  ProcurementCategoryType,
  ProcurementMethodType,
  UnitOfMeasureType,
} from 'src/shared/types/types';

export class CreatePrebudgetPlanItemDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  prebudgetId: string;

  @ApiProperty({
    type: 'enum',
    enum: FundingSource,
  })
  @IsString()
  fundingSource: string;

  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  donorId: string;

  @ApiProperty()
  @IsString()
  donorName: string;

  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  procurementCategoryId: string;

  @ApiProperty({ type: () => ProcurementCategoryType })
  @IsDefined()
  procurementCategory: ProcurementCategoryType;

  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  procurementMethodId: string;

  @ApiProperty({ type: () => ProcurementMethodType })
  @IsDefined()
  procurementMethod: ProcurementMethodType;

  @ApiProperty({ type: 'enum', enum: ProcurementStatus })
  @IsString()
  procurementStatus: string;

  @ApiProperty()
  @IsOptional()
  indigenousPreference: boolean;

  @ApiProperty({ maximum: 100 })
  @IsOptional()
  MSME: number;

  @ApiProperty()
  @IsOptional()
  marginalizedGroups: number;

  @ApiProperty({ type: 'enum', enum: ItemCodeReferenceType })
  @IsString()
  itemCodeReferenceType: string;

  @ApiProperty()
  @IsString()
  itemCode: string;

  @ApiProperty()
  @IsString()
  itemCodeDescription: string;

  @ApiProperty({ type: 'enum', enum: Currency })
  @IsString()
  currency: string;

  @ApiProperty()
  @IsNumber()
  price: number;

  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  uOMId: string;

  @ApiProperty({ type: () => UnitOfMeasureType })
  @IsDefined()
  uOM: UnitOfMeasureType;

  @ApiProperty()
  @IsNumber()
  quantity: number;

  @ApiProperty({ type: 'jsonb' })
  @IsOptional()
  frameworkContract: any;

  static fromDto(dto: CreatePrebudgetPlanItemDto): PrebudgetPlanItem {
    const entity = new PrebudgetPlanItem();
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

  static toDto(entity: PrebudgetPlanItem): CreatePrebudgetPlanItemDto {
    const dto = new CreatePrebudgetPlanItemDto();
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
