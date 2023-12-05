import { ProcurementThreshold } from '@entities';
import { CreateProcurementThresholdDto } from '../create-procurement-threshold.dto';
import { UpdateProcurementThresholdDto } from '../update-procurement-threshold.dto';

export class ProcurementThresholdMapper {
  static toEntity(
    dto: CreateProcurementThresholdDto | UpdateProcurementThresholdDto,
  ): ProcurementThreshold {
    const entity = new ProcurementThreshold();
    if ('id' in dto) {
      entity.id = dto.id;
    }
    entity.approvalDelegation = dto.approvalDelegation;
    entity.maxThreshold = dto.maxThreshold;
    entity.minThreshold = dto.minThreshold;
    entity.procurementMethod = dto.procurementMethod;
    entity.procurementType = dto.procurementType;
    return entity;
  }
}
