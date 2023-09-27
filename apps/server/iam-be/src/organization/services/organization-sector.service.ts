import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DataResponseFormat } from '../../shared/api-data';
import {
  CollectionQuery,
  QueryConstructor,
} from '../../shared/collection-query';
import {
  CreateOrganizationSectorDto,
  OrganizationSectorResponseDto,
  UpdateOrganizationSectorDto,
} from '../dto/organization-sector.dto';
import { OrganizationSector } from '../entities/organization-sector.entity';
@Injectable()
export class OrganizationSectorService {
  constructor(
    @InjectRepository(OrganizationSector)
    private readonly repository: Repository<OrganizationSector>,
  ) {}

  async create(
    organizationSector: CreateOrganizationSectorDto,
  ): Promise<OrganizationSectorResponseDto> {
    const organizationSectorEntity =
      CreateOrganizationSectorDto.fromDto(organizationSector);
    await this.repository.save(organizationSectorEntity);

    return OrganizationSectorResponseDto.toDto(organizationSectorEntity);
  }

  async update(
    id: string,
    organizationSector: UpdateOrganizationSectorDto,
  ): Promise<OrganizationSectorResponseDto> {
    organizationSector.id = id;
    const organizationSectorEntity =
      UpdateOrganizationSectorDto.fromDto(organizationSector);
    await this.repository.update(
      { id: organizationSector.id },
      organizationSectorEntity,
    );
    return OrganizationSectorResponseDto.toDto(organizationSectorEntity);
  }

  async findAll(query: CollectionQuery) {
    const dataQuery = QueryConstructor.constructQuery<OrganizationSector>(
      this.repository,
      query,
    );
    const response = new DataResponseFormat<OrganizationSectorResponseDto>();
    if (query.count) {
      response.total = await dataQuery.getCount();
    } else {
      const [result, total] = await dataQuery.getManyAndCount();
      response.total = total;
      response.items = OrganizationSectorResponseDto.toDtos(result);
    }
    return response;
  }

  async findOne(id: string): Promise<OrganizationSectorResponseDto> {
    const organizationSectorEntity = await this.repository.find({
      where: { id },
    });
    return OrganizationSectorResponseDto.toDto(organizationSectorEntity[0]);
  }

  async remove(id: string): Promise<void> {
    await this.repository.delete({ id: id });
  }
}
