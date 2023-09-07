import { InjectRepository } from '@nestjs/typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import {
  CollectionQuery,
  FilterOperators,
  QueryConstructor,
} from '@collection-query';
import { DataResponseFormat } from '@api-data';
import { ServicePriceEntity } from './entities/service-price.entity';
import {
  CreateServicePriceDto,
  ServicePriceResponseDto,
  UpdateServicePriceDto,
} from './dto/service-price.dto';
import { ServicesEntity } from './entities/services.entity';
import { ServicesResponseDto } from './dto/services.dto';

@Injectable()
export class ServicePricingService {
  constructor(
    @InjectRepository(ServicePriceEntity)
    private readonly repository: Repository<ServicePriceEntity>,
    @InjectRepository(ServicesEntity)
    private readonly serviceRepository: Repository<ServicesEntity>,
  ) {}

  async create(setting: CreateServicePriceDto): Promise<CreateServicePriceDto> {
    try {
      const entity = CreateServicePriceDto.fromDto(setting);
      await this.repository.save(entity);
      return ServicePriceResponseDto.fromEntity(entity);
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async update(
    id: string,
    regSettingDto: UpdateServicePriceDto,
  ): Promise<ServicePriceResponseDto> {
    try {
      regSettingDto.id = id;
      const entity = UpdateServicePriceDto.fromDto(regSettingDto);
      await this.repository.update({ id: regSettingDto.id }, entity);
      return ServicePriceResponseDto.fromEntity(entity);
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async findAll(query: CollectionQuery) {
    try {
      const dataQuery = QueryConstructor.constructQuery<ServicePriceEntity>(
        this.repository,
        query,
      );
      const response = new DataResponseFormat<ServicePriceResponseDto>();
      if (query.count) {
        response.total = await dataQuery.getCount();
      } else {
        const [result, total] = await dataQuery.getManyAndCount();
        response.total = total;
        result.map((entity) => ServicePriceResponseDto.fromEntity(entity));
      }
      return response;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
  async findServices(query: CollectionQuery) {
    try {
      const dataQuery = QueryConstructor.constructQuery<ServicesEntity>(
        this.serviceRepository,
        query,
      );
      const response = new DataResponseFormat<ServicesResponseDto>();
      if (query.count) {
        response.total = await dataQuery.getCount();
      } else {
        const [result, total] = await dataQuery.getManyAndCount();
        response.total = total;
        result.map((entity) => ServicesResponseDto.fromEntity(entity));
      }
      return response;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async findOne(id: string): Promise<ServicePriceResponseDto> {
    try {
      const price = await this.repository.findOne({ where: { id } });
      return ServicePriceResponseDto.fromEntity(price);
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
}
