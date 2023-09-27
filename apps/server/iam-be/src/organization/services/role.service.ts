import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DataResponseFormat } from '../../shared/api-data';
import {
  CollectionQuery,
  QueryConstructor,
} from '../../shared/collection-query';
import { CreateRoleDto, RoleResponseDto, UpdateRoleDto } from '../dto/role.dto';
import { Role } from '../entities/role.entity';
import {
  CreateRolePermissionDto,
  RolePermissionResponseDto,
} from '../dto/role-permission.dto';
import { v4 as uuidv4 } from 'uuid';
import { RolePermission } from '../entities/role-permission.entity';
import { t } from 'xstate';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly repository: Repository<Role>,
    @InjectRepository(RolePermission)
    private readonly rolePermissionsrepository: Repository<RolePermission>,
  ) {}

  async create(role: CreateRoleDto): Promise<RoleResponseDto> {
    if (!role.organizationId) {
      role.isSystemRole = true;
    }
    const roleEntity = CreateRoleDto.fromDto(role);
    await this.repository.save(roleEntity);

    return RoleResponseDto.toDto(roleEntity);
  }

  async update(id: string, role: UpdateRoleDto): Promise<RoleResponseDto> {
    role.id = id;
    if (!role.organizationId) {
      role.isSystemRole = true;
    }
    const roleEntity = UpdateRoleDto.fromDto(role);
    await this.repository.update({ id: role.id }, roleEntity);
    return RoleResponseDto.toDto(roleEntity);
  }

  async findAll(query: CollectionQuery) {
    const dataQuery = QueryConstructor.constructQuery<Role>(
      this.repository,
      query,
    );
    const response = new DataResponseFormat<RoleResponseDto>();
    if (query.count) {
      response.total = await dataQuery.getCount();
    } else {
      const [result, total] = await dataQuery.getManyAndCount();
      response.total = total;
      response.items = RoleResponseDto.toDtos(result);
    }
    return response;
  }

  async findOne(
    id: string,
    includes: any,
    withDeleted = false,
  ): Promise<RoleResponseDto> {
    const roleEntity = await this.repository.findOne({
      where: { id: id },
      relations: includes.includes,
      withDeleted: withDeleted,
    });
    return RoleResponseDto.toDto(roleEntity);
  }
  async findAllUnderOrganization(organizationId, query: CollectionQuery) {
    const dataQuery = QueryConstructor.constructQuery<Role>(
      this.repository,
      query,
    )
      .innerJoin('roles.rolePermissions', 'rolePermissions')
      .innerJoin('rolePermissions.permission', 'permission')
      .orWhere('roles.organizationId = :organizationId', { organizationId })
      .orWhere('roles.organizationId IS NULL');
    const response = new DataResponseFormat<RoleResponseDto>();

    if (query.count) {
      response.total = await dataQuery.getCount();
    } else {
      const [result, total] = await dataQuery.getManyAndCount();
      response.total = total;
      response.items = RoleResponseDto.toDtos(result);
    }

    return response;
  }
  async findAllRolePermissions(roleId, query: CollectionQuery) {
    const dataQuery = QueryConstructor.constructQuery<RolePermission>(
      this.rolePermissionsrepository,
      query,
    ).andWhere('role_permissions.roleId = :roleId', { roleId });

    const response = new DataResponseFormat<RolePermissionResponseDto>();

    if (query.count) {
      response.total = await dataQuery.getCount();
    } else {
      const [result, total] = await dataQuery.getManyAndCount();
      response.total = total;
      response.items = RolePermissionResponseDto.toDtos(result);
    }

    return response;
  }
  async remove(id: string): Promise<void> {
    const roleEntity = await this.repository.findOne({
      where: { id },
    });
    if (!roleEntity.organizationId) {
      throw new HttpException(
        'Can not delete System roles',
        HttpStatus.NOT_FOUND,
      );
    }
    await this.repository.delete({ id: id });
  }
  async assignPermissions(
    id: string,
    rolePermissions: CreateRolePermissionDto[],
  ): Promise<RoleResponseDto> {
    const roleEntity = await this.repository.findOne({
      where: { id },
      relations: ['userRoles', 'rolePermissions'],
    });

    const updatedRolePermissions = rolePermissions.map((permission) => ({
      ...permission,
      id: uuidv4(),
    }));

    roleEntity.rolePermissions = CreateRolePermissionDto.fromDtos(
      updatedRolePermissions,
    );

    const updatedRoleEntity = await this.repository.save(roleEntity);

    return RoleResponseDto.toDto(updatedRoleEntity);
  }
}
