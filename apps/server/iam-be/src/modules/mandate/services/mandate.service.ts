import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { DataSource, IsNull, Repository } from 'typeorm';
import { Mandate } from '@entities';
import { CollectionQuery, QueryConstructor } from '@collection-query';
import { DataResponseFormat } from '@api-data';
import { EntityCrudService } from 'src/shared/service/entity-crud.service';
import { MandateResponseDto } from '../dto/mandate.dto';
import { OrganizationMandate } from '@entities';

@Injectable()
export class MandateService extends EntityCrudService<Mandate> {
  constructor(
    @InjectRepository(Mandate)
    private readonly repositoryMandate: Repository<Mandate>,
    @InjectRepository(OrganizationMandate)
    private readonly repositoryOrganizationMandate: Repository<OrganizationMandate>,
  ) {
    super(repositoryMandate);
  }

  async fetchMandatesToAssign(organizationId: string, query: CollectionQuery) {
    const assignedMandates = await this.repositoryOrganizationMandate.find({
      where: {
        mandate: {
          isSingleAssignment: true,
        },
      },
    });
    const mandateId = [];

    assignedMandates.forEach((element) => {
      if (element.organizationId != organizationId) {
        mandateId.push(element.mandateId);
      }
    });

    if (mandateId.length > 0) {
      query.where.push([
        {
          column: 'id',
          value: mandateId,
          operator: 'NotIn',
        },
      ]);
    }

    const dataQuery = QueryConstructor.constructQuery<Mandate>(
      this.repositoryMandate,
      query,
    );

    const response = new DataResponseFormat<Mandate>();
    if (query.count) {
      response.total = await dataQuery.getCount();
    } else {
      const [result, total] = await dataQuery.getManyAndCount();
      response.items = result;
      response.total = total;
    }
    return response;
  }
}
