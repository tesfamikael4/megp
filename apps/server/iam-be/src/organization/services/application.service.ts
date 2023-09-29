import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DataResponseFormat } from '../../shared/api-data';
import {
  CollectionQuery,
  QueryConstructor,
} from '../../shared/collection-query';
import {
  CreateApplicationDto,
  ApplicationResponseDto,
  UpdateApplicationDto,
} from '../dto/application.dto';
import { Application } from '../entities/application.entity';
@Injectable()
export class ApplicationService {
  constructor(
    @InjectRepository(Application)
    private readonly repository: Repository<Application>,
  ) {}

  async create(
    application: CreateApplicationDto,
  ): Promise<ApplicationResponseDto> {
    const applicationEntity = CreateApplicationDto.fromDto(application);
    await this.repository.save(applicationEntity);

    return ApplicationResponseDto.toDto(applicationEntity);
  }

  async update(
    id: string,
    application: UpdateApplicationDto,
  ): Promise<ApplicationResponseDto> {
    application.id = id;
    const applicationEntity = UpdateApplicationDto.fromDto(application);
    await this.repository.update({ id: application.id }, applicationEntity);
    return ApplicationResponseDto.toDto(applicationEntity);
  }

  async findAll(query: CollectionQuery) {
    const dataQuery = QueryConstructor.constructQuery<Application>(
      this.repository,
      query,
    );
    const response = new DataResponseFormat<ApplicationResponseDto>();
    if (query.count) {
      response.total = await dataQuery.getCount();
    } else {
      const [result, total] = await dataQuery.getManyAndCount();
      response.total = total;
      response.items = ApplicationResponseDto.toDtos(result);
    }
    return response;
  }

  async findOne(
    id: string,
    includes: any,
    withDeleted: boolean,
  ): Promise<ApplicationResponseDto> {
    const applicationEntity = await this.repository.findOne({
      where: { id: id },
      relations: includes.includes,
      withDeleted: withDeleted,
    });

    return ApplicationResponseDto.toDto(applicationEntity);
  }

  async remove(id: string): Promise<void> {
    await this.repository.delete({ id: id });
  }
}
