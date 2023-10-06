import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { PrebudgetPlan } from '../entities/prebudget-plan.entity';
import {
  CollectionQuery,
  QueryConstructor,
} from '../../shared/collection-query';
import { PrebudgetPlanResponseDto } from '../dto/prebudget-plan-dto';
import { DataResponseFormat } from 'src/shared/api-data';
import { EntityCrudService } from 'src/shared/service/entity-crud.service';

@Injectable()
export class PrebudgetPlanService extends EntityCrudService<PrebudgetPlan> {
  constructor(
    @InjectRepository(PrebudgetPlan)
    private readonly prebugetRepository: Repository<PrebudgetPlan>,
  ) {
    super(prebugetRepository);
  }
  async softDelete(id: string): Promise<boolean> {
    const response = await this.prebugetRepository.softDelete(id);
    return response.affected > 0 ? true : false;
  }
  async restore(id: string): Promise<boolean> {
    const response = await this.prebugetRepository.restore(id);
    if (response.affected > 0) return true;
    return false;
  }
  async getArchivedPrebudgetPlans(
    query: CollectionQuery,
  ): Promise<DataResponseFormat<PrebudgetPlanResponseDto>> {
    try {
      const dataQuery = QueryConstructor.constructQuery<PrebudgetPlan>(
        this.prebugetRepository,
        query,
      );
      dataQuery.withDeleted();
      dataQuery
        .andWhere('prebudgets.deleted_at IS NOT NULL')
        .orderBy('prebudgets.updated_at', 'ASC');
      const d = new DataResponseFormat<PrebudgetPlanResponseDto>();
      if (query.count) {
        d.total = await dataQuery.getCount();
      } else {
        const [result, total] = await dataQuery.getManyAndCount();
        d.items = result.map((entity) =>
          PrebudgetPlanResponseDto.toDto(entity),
        );
        d.total = total;
      }
      return d;
    } catch (error) {
      throw new BadRequestException(error.code, error.message);
    }
  }
}
