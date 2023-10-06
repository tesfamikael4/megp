import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { PrebudgetPlanItem } from '../entities/prebudget-item.entity';
import {
  CollectionQuery,
  QueryConstructor,
} from '../../shared/collection-query';
import { PrebudgetPlanItemResponseDto } from '../dto/prebudget-item-dto';
import { DataResponseFormat } from 'src/shared/api-data';
import { EntityCrudService } from 'src/shared/service/entity-crud.service';

@Injectable()
export class PrebudgetPlanItemService extends EntityCrudService<PrebudgetPlanItem> {
  constructor(
    @InjectRepository(PrebudgetPlanItem)
    private readonly prebugetPlanItemRepository: Repository<PrebudgetPlanItem>,
  ) {
    super(prebugetPlanItemRepository);
  }

  async softDelete(id: string): Promise<boolean> {
    const response = await this.prebugetPlanItemRepository.softDelete(id);
    return response.affected > 0 ? true : false;
  }
  async restore(id: string): Promise<boolean> {
    const response = await this.prebugetPlanItemRepository.restore(id);
    if (response.affected > 0) return true;
    return false;
  }
  async getArchivedPrebudgetPlanItems(
    query: CollectionQuery,
  ): Promise<DataResponseFormat<PrebudgetPlanItemResponseDto>> {
    try {
      const dataQuery = QueryConstructor.constructQuery<PrebudgetPlanItem>(
        this.prebugetPlanItemRepository,
        query,
      );
      dataQuery.withDeleted();
      dataQuery
        .andWhere('prebudgets.deleted_at IS NOT NULL')
        .orderBy('prebudgets.updated_at', 'ASC');
      const d = new DataResponseFormat<PrebudgetPlanItemResponseDto>();
      if (query.count) {
        d.total = await dataQuery.getCount();
      } else {
        const [result, total] = await dataQuery.getManyAndCount();
        d.items = result.map((entity) =>
          PrebudgetPlanItemResponseDto.toDto(entity),
        );
        d.total = total;
      }
      return d;
    } catch (error) {
      throw new BadRequestException(error.code, error.message);
    }
  }
}
