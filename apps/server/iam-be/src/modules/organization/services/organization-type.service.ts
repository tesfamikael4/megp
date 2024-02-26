import { EntityCrudService } from 'src/shared/service/entity-crud.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DataResponseFormat } from 'src/shared/api-data';
import { OrganizationType } from '@entities';
import { QueryConstructor, CollectionQuery } from 'src/shared/collection-query';

@Injectable()
export class OrganizationTypeService extends EntityCrudService<OrganizationType> {
  constructor(
    @InjectRepository(OrganizationType)
    private readonly groupRepository: Repository<OrganizationType>,
  ) {
    super(groupRepository);
  }

  async getAllOrganizationTypes(query: CollectionQuery) {
    try {
      const dataQuery = QueryConstructor.constructQuery<OrganizationType>(
        this.groupRepository,
        query,
      );

      const response = new DataResponseFormat<OrganizationType>();

      const [result, total] = await dataQuery.getManyAndCount();
      response.total = total;
      response.items = result;

      return response;
    } catch (error) {
      console.log(
        '🚀 ~ file: group.service.ts:32 ~ OrganizationTypeService ~ getAllOrganizationTypes ~ error:',
        error,
      );
    }
  }

  async softDelete(id: string, req?: any): Promise<void> {
    const organizationType = await this.groupRepository.findOne({
      where: { id },
      relations: {
        organizations: true,
      },
    });
    if (!organizationType) throw new NotFoundException(`not_found`);

    if (organizationType.organizations.length > 0)
      throw new ForbiddenException(`cant_delete`);

    await this.groupRepository.softDelete(id);
  }
}
