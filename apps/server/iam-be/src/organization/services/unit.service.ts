import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DataResponseFormat } from '../../shared/api-data';
import {
  CollectionQuery,
  QueryConstructor,
} from '../../shared/collection-query';
import { CreateUnitDto, UnitResponseDto, UpdateUnitDto } from '../dto/unit.dto';
import { Unit } from '../entities/unit.entity';
import { CreateUserUnitDto } from '../dto/employee-unit.dto';
@Injectable()
export class UnitService {
  constructor(
    @InjectRepository(Unit)
    private readonly repository: Repository<Unit>,
  ) {}

  async create(unit: CreateUnitDto): Promise<UnitResponseDto> {
    const unitEntity = CreateUnitDto.fromDto(unit);
    await this.repository.save(unitEntity);

    return UnitResponseDto.toDto(unitEntity);
  }

  async update(id: string, unit: UpdateUnitDto): Promise<UnitResponseDto> {
    unit.id = id;
    const unitEntity = UpdateUnitDto.fromDto(unit);
    await this.repository.update({ id: unit.id }, unitEntity);
    return UnitResponseDto.toDto(unitEntity);
  }

  async findAll(query: CollectionQuery) {
    const dataQuery = QueryConstructor.constructQuery<Unit>(
      this.repository,
      query,
    );
    const response = new DataResponseFormat<UnitResponseDto>();
    if (query.count) {
      response.total = await dataQuery.getCount();
    } else {
      const [result, total] = await dataQuery.getManyAndCount();
      response.total = total;
      response.items = UnitResponseDto.toDtos(result);
    }
    return response;
  }

  async findOne(
    id: string,
    includes: any,
    withDeleted = false,
  ): Promise<UnitResponseDto> {
    const unitEntity = await this.repository.findOne({
      where: { id: id },
      relations: includes.includes,
      withDeleted: withDeleted,
    });
    return UnitResponseDto.toDto(unitEntity);
  }
  async activation(id: string): Promise<UnitResponseDto> {
    const unitEntity = await this.repository.findOne({
      where: { id: id },
      relations: ['userUnits'],
    });
    unitEntity.isActive = !unitEntity.isActive;
    await this.repository.update({ id: id }, unitEntity);
    return UnitResponseDto.toDto(unitEntity);
  }
  async remove(id: string): Promise<void> {
    await this.repository.delete({ id: id });
  }
  async assignUsers(
    id: string,
    userUnit: CreateUserUnitDto[],
  ): Promise<UnitResponseDto> {
    const unitEntity = await this.repository.findOne({
      where: { id: id },
      relations: [],
    });
    const userUnits = CreateUserUnitDto.fromDtos(userUnit);
    unitEntity.userUnits = userUnits;
    const result = await this.repository.save(unitEntity);
    return UnitResponseDto.toDto(result);
  }
}
