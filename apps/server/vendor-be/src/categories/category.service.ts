import { InjectRepository } from '@nestjs/typeorm';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import {
  CollectionQuery,
  FilterOperators,
  QueryConstructor,
} from '@collection-query';
import { DataResponseFormat } from '@api-data';
import { CategoryEntity } from './entities/category.entity';
import {
  CategoryResponseDto,
  CreateCategoryDto,
  UpdateCategoryDto,
} from './dto/category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly repository: Repository<CategoryEntity>,
  ) {}

  async create(dto: CreateCategoryDto): Promise<CategoryResponseDto> {
    try {
      const entity = CreateCategoryDto.fromDto(dto);
      entity.createdBy = '5a16b0a5-c627-47ec-9133-18a02c40be47';
      await this.repository.save(entity);
      return CategoryResponseDto.fromEntity(entity);
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async update(
    id: string,
    dto: UpdateCategoryDto,
  ): Promise<CategoryResponseDto> {
    try {
      dto.id = id;
      const entity = UpdateCategoryDto.fromDto(dto);
      await this.repository.update({ id: dto.id }, entity);
      return CategoryResponseDto.fromEntity(entity);
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async findAll(query: CollectionQuery) {
    try {
      // query.filter.push([{ field: 'business_area', operator: FilterOperators.EqualTo, value: "Services" }])
      const dataQuery = QueryConstructor.constructQuery<CategoryEntity>(
        this.repository,
        query,
      );
      const response = new DataResponseFormat<CategoryResponseDto>();
      if (query.count) {
        response.total = await dataQuery.getCount();
      } else {
        const [result, total] = await dataQuery.getManyAndCount();
        response.total = total;
        response.items = result.map((entity) =>
          CategoryResponseDto.fromEntity(entity),
        );
      }
      return response;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async findOne(id: string): Promise<CategoryResponseDto> {
    try {
      const entity = await this.repository.findOne({ where: { id } });
      return CategoryResponseDto.fromEntity(entity);
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.repository.delete({ id: id });
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
  async softDelete(id: string): Promise<boolean> {
    const response = await this.repository.softDelete(id);
    return response.affected > 0 ? true : false;
  }

  async restore(id: string): Promise<boolean> {
    const response = await this.repository.restore(id);
    if (response.affected > 0) return true;
    return false;
  }
  async getArchivedCategories(
    query: CollectionQuery,
  ): Promise<DataResponseFormat<CategoryResponseDto>> {
    try {
      const dataQuery = QueryConstructor.constructQuery<CategoryEntity>(
        this.repository,
        query,
      );
      dataQuery.withDeleted();
      dataQuery
        .andWhere('categories.deleted_at IS NOT NULL')
        .orderBy('categories.updated_at', 'ASC');
      const d = new DataResponseFormat<CategoryResponseDto>();
      if (query.count) {
        d.total = await dataQuery.getCount();
      } else {
        const [result, total] = await dataQuery.getManyAndCount();
        d.items = result.map((entity) =>
          CategoryResponseDto.fromEntity(entity),
        );
        d.total = total;
      }
      return d;
    } catch (error) {
      throw new BadRequestException(error.code, error.message);
    }
  }
}
