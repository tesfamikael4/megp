import { InjectRepository } from '@nestjs/typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import {
  CollectionQuery,
  FilterOperators,
  QueryConstructor,
} from '@collection-query';
import { DataResponseFormat } from '@api-data';
import { ApplicationEntity } from './entities/application.entity';
import {
  CreateRegistrationRequisitionDto,
  RegistrationRequisitionResponseDto,
  UpdateRegistrationRequisitionDto,
} from './dto/application.dto';
import { ServicesEntity } from './entities/services.entity';
import { ServicesResponseDto } from './dto/services.dto';

@Injectable()
export class VendorRegistrationsService {
  constructor(
    @InjectRepository(ApplicationEntity)
    private readonly repository: Repository<ApplicationEntity>,
    @InjectRepository(ServicesEntity)
    private readonly serviceRepository: Repository<ServicesEntity>,
  ) {}

  async create(
    setting: CreateRegistrationRequisitionDto,
  ): Promise<RegistrationRequisitionResponseDto> {
    try {
      const registrationSettingEntity =
        CreateRegistrationRequisitionDto.fromDto(setting);
      await this.repository.save(registrationSettingEntity);
      return RegistrationRequisitionResponseDto.fromEntity(
        registrationSettingEntity,
      );
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async update(
    id: string,
    regSettingDto: UpdateRegistrationRequisitionDto,
  ): Promise<RegistrationRequisitionResponseDto> {
    try {
      regSettingDto.id = id;
      const regSettingEntity =
        UpdateRegistrationRequisitionDto.fromDto(regSettingDto);
      await this.repository.update({ id: regSettingDto.id }, regSettingEntity);
      return RegistrationRequisitionResponseDto.fromEntity(regSettingEntity);
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async findAll(query: CollectionQuery) {
    try {
      const dataQuery = QueryConstructor.constructQuery<ApplicationEntity>(
        this.repository,
        query,
      );
      const response =
        new DataResponseFormat<RegistrationRequisitionResponseDto>();
      if (query.count) {
        response.total = await dataQuery.getCount();
      } else {
        const [result, total] = await dataQuery.getManyAndCount();
        response.total = total;
        result.map((entity) =>
          RegistrationRequisitionResponseDto.fromEntity(entity),
        );
      }
      return response;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async findOne(id: string): Promise<RegistrationRequisitionResponseDto> {
    try {
      const todoEntity = await this.repository.findOne({ where: { id } });
      return RegistrationRequisitionResponseDto.fromEntity(todoEntity);
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
  ////
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
}
