import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DataResponseFormat } from '../../shared/api-data';
import {
  CollectionQuery,
  QueryConstructor,
} from '../../shared/collection-query';
import {
  CreateUserDto,
  UserResponseDto,
  UpdateUserDto,
} from '../dto/employee.dto';
import { User } from '../entities/employee.entity';
import { CreateUserUnitDto } from '../dto/employee-unit.dto';
import { CreateUserRoleDto } from '../dto/employee-role.dto';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) {}

  async create(user: CreateUserDto): Promise<UserResponseDto> {
    const userEntity = CreateUserDto.fromDto(user);
    await this.repository.save(userEntity);

    return UserResponseDto.toDto(userEntity);
  }

  async update(id: string, user: UpdateUserDto): Promise<UserResponseDto> {
    user.id = id;
    const userEntity = UpdateUserDto.fromDto(user);
    await this.repository.update({ id: user.id }, userEntity);
    return UserResponseDto.toDto(userEntity);
  }

  async findAll(query: CollectionQuery) {
    const dataQuery = QueryConstructor.constructQuery<User>(
      this.repository,
      query,
    );
    const response = new DataResponseFormat<UserResponseDto>();
    if (query.count) {
      response.total = await dataQuery.getCount();
    } else {
      const [result, total] = await dataQuery.getManyAndCount();
      response.total = total;
      response.items = UserResponseDto.toDtos(result);
    }
    return response;
  }

  async findOne(
    id: string,
    includes: any,
    withDeleted = false,
  ): Promise<UserResponseDto> {
    const userEntity = await this.repository.findOne({
      where: { id: id },
      relations: includes.includes,
      withDeleted: withDeleted,
    });
    return UserResponseDto.toDto(userEntity);
  }

  async remove(id: string): Promise<void> {
    await this.repository.delete({ id: id });
  }
  async activation(id: string): Promise<UserResponseDto> {
    const userEntity = await this.repository.findOne({
      where: { id: id },
      relations: ['userUnits', 'userProfile', 'userRoles'],
    });
    userEntity.isActive = !userEntity.isActive;
    await this.repository.update({ id: id }, userEntity);
    return UserResponseDto.toDto(userEntity);
  }
  async assignUnits(
    id: string,
    userUnit: CreateUserUnitDto[],
  ): Promise<UserResponseDto> {
    const userEntity = await this.repository.findOne({
      where: { id: id },
      relations: ['userProfile', 'userRoles'],
    });
    const userUnits = CreateUserUnitDto.fromDtos(userUnit);
    userEntity.userUnits = userUnits;
    const result = await this.repository.save(userEntity);
    return UserResponseDto.toDto(result);
  }

  async assignRoles(
    id: string,
    userRole: CreateUserRoleDto[],
  ): Promise<UserResponseDto> {
    const userEntity = await this.repository.findOne({
      where: { id: id },
      relations: ['userUnits', 'userProfile'],
    });
    const userRoles = CreateUserRoleDto.fromDtos(userRole);
    userEntity.userRoles = userRoles;
    const result = await this.repository.save(userEntity);
    return UserResponseDto.toDto(result);
  }
}
