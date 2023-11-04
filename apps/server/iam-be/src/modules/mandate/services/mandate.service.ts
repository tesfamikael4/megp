import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Mandate } from '@entities';
import { CollectionQuery } from '@collection-query';
import { DataResponseFormat } from '@api-data';
import { EntityCrudService } from 'src/shared/service/entity-crud.service';
import { MandateResponseDto } from '../dto/mandate.dto';
import { OrganizationMandate } from '@entities';

@Injectable()
export class MandateService extends EntityCrudService<Mandate> {
  constructor(
    @InjectRepository(Mandate)
    private readonly repositoryMandate: Repository<Mandate>,
    private dataSource: DataSource,
  ) {
    super(repositoryMandate);
  }
  async fetchMandatesToAssign(
    organizationId: string,
    query: CollectionQuery,
  ): Promise<DataResponseFormat<MandateResponseDto>> {
    const assignedMandates = await this.dataSource
      .createQueryBuilder()
      .select('organizationMandates')
      .from(OrganizationMandate, 'organizationMandates')
      .innerJoin(
        'organizationMandates.mandate',
        'mandate',
        'mandate.id = organizationMandates.mandateId',
      )
      .where('mandate.isSingleAssignment = :isSingleAssignment', {
        isSingleAssignment: true,
      })
      .andWhere('organizationMandates.organizationId != :organizationId', {
        organizationId,
      })
      .getMany();
    const a: any = [];
    assignedMandates.map((element) => {
      a.push(element.mandateId);
    });
    const dataQuery = this.repositoryMandate.createQueryBuilder('mandate');
    dataQuery.innerJoin('mandate.mandatePermissions', 'mandatePermissions'); // it should have at least one mandate permission to assign
    if (a.length > 0) {
      dataQuery.andWhere('mandate.id NOT IN (:...ids)', { ids: a });
    }
    const d = new DataResponseFormat<MandateResponseDto>();
    if (query.count) {
      d.total = await dataQuery.getCount();
    } else {
      const [result, total] = await dataQuery.getManyAndCount();
      d.items = result.map((entity) => MandateResponseDto.toDto(entity));
      d.total = total;
    }
    return d;
  }
}
