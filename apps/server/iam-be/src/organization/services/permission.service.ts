import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DataResponseFormat } from '../../shared/api-data';
import {
  CollectionQuery,
  QueryConstructor,
} from '../../shared/collection-query';
import {
  CreatePermissionDto,
  PermissionResponseDto,
  UpdatePermissionDto,
} from '../dto/permission.dto';
import { Permission } from '../entities/permission.entity';
@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private readonly repository: Repository<Permission>,
  ) {}

  async create(
    permission: CreatePermissionDto,
  ): Promise<PermissionResponseDto> {
    const permissionEntity = CreatePermissionDto.fromDto(permission);
    await this.repository.save(permissionEntity);

    return PermissionResponseDto.toDto(permissionEntity);
  }

  async update(
    id: string,
    permission: UpdatePermissionDto,
  ): Promise<PermissionResponseDto> {
    permission.id = id;
    const permissionEntity = UpdatePermissionDto.fromDto(permission);
    await this.repository.update({ id: permission.id }, permissionEntity);
    return PermissionResponseDto.toDto(permissionEntity);
  }

  async findAll(query: CollectionQuery) {
    const dataQuery = QueryConstructor.constructQuery<Permission>(
      this.repository,
      query,
    );
    const response = new DataResponseFormat<PermissionResponseDto>();
    if (query.count) {
      response.total = await dataQuery.getCount();
    } else {
      const [result, total] = await dataQuery.getManyAndCount();
      response.total = total;
      response.items = PermissionResponseDto.toDtos(result);
    }
    return response;
  }
  async findAllUnderApplication(applicationId, query: CollectionQuery) {
    const dataQuery = QueryConstructor.constructQuery<Permission>(
      this.repository,
      query,
    ).andWhere('permissions.applicationId=:applicationId', { applicationId });
    const response = new DataResponseFormat<PermissionResponseDto>();
    if (query.count) {
      response.total = await dataQuery.getCount();
    } else {
      const [result, total] = await dataQuery.getManyAndCount();
      response.total = total;
      response.items = PermissionResponseDto.toDtos(result);
    }
    return response;
  }

  async findAllUnderOrganization(organizationId, query: CollectionQuery) {
    const dataQuery = QueryConstructor.constructQuery<Permission>(
      this.repository,
      query,
    )
      .innerJoin('permissions.mandatePermissions', 'mandatePermissions')
      .innerJoin('mandatePermissions.mandate', 'mandate')
      .innerJoin('mandate.organizationMandates', 'organizationMandates')
      .where('organizationMandates.organizationId = :organizationId', {
        organizationId,
      });

    const response = new DataResponseFormat<PermissionResponseDto>();

    if (query.count) {
      response.total = await dataQuery.getCount();
    } else {
      const [result, total] = await dataQuery.getManyAndCount();
      response.total = total;
      response.items = PermissionResponseDto.toDtos(result);
    }

    return response;
  }
  async findOne(id: string): Promise<PermissionResponseDto> {
    const permissionEntity = await this.repository.find({
      where: { id },
    });
    return PermissionResponseDto.toDto(permissionEntity[0]);
  }

  async remove(id: string): Promise<void> {
    await this.repository.delete({ id: id });
  }
}
