import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DataResponseFormat } from '../../shared/api-data';
import {
  CollectionQuery,
  QueryConstructor,
} from '../../shared/collection-query';
import {
  CreateUnitTypeDto,
  UnitTypeResponseDto,
  UpdateUnitTypeDto,
} from '../dto/unit-type.dto';
import { UnitType } from '../entities/unit-type.entity';
@Injectable()
export class UnitTypeService {
  constructor(
    @InjectRepository(UnitType)
    private readonly repository: Repository<UnitType>,
  ) {}

  async create(unitType: CreateUnitTypeDto): Promise<UnitTypeResponseDto> {
    const unitTypeEntity = CreateUnitTypeDto.fromDto(unitType);
    await this.repository.save(unitTypeEntity);

    return UnitTypeResponseDto.toDto(unitTypeEntity);
  }

  async update(
    id: string,
    unitType: UpdateUnitTypeDto,
  ): Promise<UnitTypeResponseDto> {
    unitType.id = id;
    const unitTypeEntity = UpdateUnitTypeDto.fromDto(unitType);
    await this.repository.update({ id: unitType.id }, unitTypeEntity);
    return UnitTypeResponseDto.toDto(unitTypeEntity);
  }

  async findAll(query: CollectionQuery) {
    const dataQuery = QueryConstructor.constructQuery<UnitType>(
      this.repository,
      query,
    );
    const response = new DataResponseFormat<UnitTypeResponseDto>();
    if (query.count) {
      response.total = await dataQuery.getCount();
    } else {
      const [result, total] = await dataQuery.getManyAndCount();
      response.total = total;
      response.items = UnitTypeResponseDto.toDtos(result);
    }
    return response;
  }

  async findOne(
    id: string,
    includes,
    withDeleted = false,
  ): Promise<UnitTypeResponseDto> {
    const unitTypeEntity = await this.repository.findOne({
      where: { id: id },
      relations: includes.includes,
      withDeleted: withDeleted,
    });
    return UnitTypeResponseDto.toDto(unitTypeEntity);
  }

  async remove(id: string): Promise<void> {
    await this.repository.delete({ id: id });
  }
}
