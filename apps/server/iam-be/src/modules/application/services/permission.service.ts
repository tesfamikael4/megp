import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Permission } from '@entities';
import { ExtraCrudService } from 'src/shared/service/extra-crud.service';
import { DataResponseFormat } from 'src/shared/api-data';
import { CollectionQuery, QueryConstructor } from 'src/shared/collection-query';
import { PermissionResponseDto } from '../dto/permission.dto';

@Injectable()
export class PermissionService extends ExtraCrudService<Permission> {
  constructor(
    @InjectRepository(Permission)
    private readonly repositoryPermission: Repository<Permission>,
  ) {
    super(repositoryPermission);
  }

  async findUnderOrganization(organizationId, query: CollectionQuery) {
    const dataQuery = QueryConstructor.constructQuery<Permission>(
      this.repositoryPermission,
      query,
    )
      .innerJoin('permissions.mandatePermissions', 'mandatePermissions')
      .innerJoin('mandatePermissions.mandate', 'mandate')
      .innerJoin('mandate.organizationMandates', 'organizationMandates')
      .andWhere('organizationMandates.organizationId=:organizationId', {
        organizationId,
      });

    const response = new DataResponseFormat<PermissionResponseDto>();

    if (query.count) {
      response.total = await dataQuery.getCount();
    } else {
      const [items, total] = await dataQuery.getManyAndCount();
      response.total = total;
      response.items = PermissionResponseDto.toDtos(items);
    }

    return response;
  }
}
