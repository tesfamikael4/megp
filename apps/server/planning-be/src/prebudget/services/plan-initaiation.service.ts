import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { PlanInitiation } from '../entities/plan-initiation.entity';
import { DataResponseFormat } from 'src/shared/api-data';
import { CollectionQuery, QueryConstructor } from 'src/shared/collection-query';
import { PlanInitiationResponseDto } from '../dto/plan-initiation-dto';
import { EntityCrudService } from 'src/shared/service/entity-crud.service';

@Injectable()
export class PlanInitiationService extends EntityCrudService<PlanInitiation> {
  constructor(
    @InjectRepository(PlanInitiation)
    private readonly planRepository: Repository<PlanInitiation>,
  ) {
    super(planRepository);
  }
  async softDelete(id: string): Promise<boolean> {
    const response = await this.planRepository.softDelete(id);
    return response.affected > 0 ? true : false;
  }
  async restore(id: string): Promise<boolean> {
    const response = await this.planRepository.restore(id);
    if (response.affected > 0) return true;
    return false;
  }
  async getArchivedApps(
    query: CollectionQuery,
  ): Promise<DataResponseFormat<PlanInitiationResponseDto>> {
    try {
      const dataQuery = QueryConstructor.constructQuery<PlanInitiation>(
        this.planRepository,
        query,
      );
      dataQuery.withDeleted();
      dataQuery
        .andWhere('apps.deleted_at IS NOT NULL')
        .orderBy('apps.updated_at', 'ASC');
      const d = new DataResponseFormat<PlanInitiationResponseDto>();
      if (query.count) {
        d.total = await dataQuery.getCount();
      } else {
        const [result, total] = await dataQuery.getManyAndCount();
        d.items = result.map((entity) =>
          PlanInitiationResponseDto.toDto(entity),
        );
        d.total = total;
      }
      return d;
    } catch (error) {
      throw new BadRequestException(error.code, error.message);
    }
  }
}
