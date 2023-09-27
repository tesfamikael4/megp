import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DataResponseFormat } from '../../shared/api-data';
import {
  CollectionQuery,
  QueryConstructor,
} from '../../shared/collection-query';
import {
  CreateOrganizationTypeDto,
  OrganizationTypeResponseDto,
  UpdateOrganizationTypeDto,
} from '../dto/organization-type.dto';
import { OrganizationType } from '../entities/organization-type.entity';
@Injectable()
export class OrganizationTypeService {
  constructor(
    @InjectRepository(OrganizationType)
    private readonly repository: Repository<OrganizationType>,
  ) {}

  async create(
    organizationType: CreateOrganizationTypeDto,
  ): Promise<OrganizationTypeResponseDto> {
    const organizationTypeEntity =
      CreateOrganizationTypeDto.fromDto(organizationType);
    await this.repository.save(organizationTypeEntity);

    return OrganizationTypeResponseDto.toDto(organizationTypeEntity);
  }

  async update(
    id: string,
    organizationType: UpdateOrganizationTypeDto,
  ): Promise<OrganizationTypeResponseDto> {
    organizationType.id = id;
    const organizationTypeEntity =
      UpdateOrganizationTypeDto.fromDto(organizationType);
    await this.repository.update(
      { id: organizationType.id },
      organizationTypeEntity,
    );
    return OrganizationTypeResponseDto.toDto(organizationTypeEntity);
  }

  async findAll(query: CollectionQuery) {
    const dataQuery = QueryConstructor.constructQuery<OrganizationType>(
      this.repository,
      query,
    );
    const response = new DataResponseFormat<OrganizationTypeResponseDto>();
    if (query.count) {
      response.total = await dataQuery.getCount();
    } else {
      const [result, total] = await dataQuery.getManyAndCount();
      response.total = total;
      response.items = OrganizationTypeResponseDto.toDtos(result);
    }
    return response;
  }

  async findOne(id: string): Promise<OrganizationTypeResponseDto> {
    const organizationTypeEntity = await this.repository.find({
      where: { id },
    });
    return OrganizationTypeResponseDto.toDto(organizationTypeEntity[0]);
  }

  async remove(id: string): Promise<void> {
    await this.repository.delete({ id: id });
  }
}
