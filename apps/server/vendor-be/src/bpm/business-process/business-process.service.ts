import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessProcessEntity } from './entities/business-process';
import { Repository } from 'typeorm';
import { BusinessProcessResponse } from './business-process.response';
import { DataResponseFormat } from 'src/shared/api-data';
import { CollectionQuery, QueryConstructor } from 'src/shared/collection-query';
import {
  CreateBusinessProcessDto,
  UpdateBusinessProcessDto,
} from './dtos/business-process.dto';

@Injectable()
export class BusinessProcessService {
  constructor(
    @InjectRepository(BusinessProcessEntity)
    private readonly businessProcessRepository: Repository<BusinessProcessEntity>,
  ) {}
  async getBusinessProcesses(
    query: CollectionQuery,
  ): Promise<DataResponseFormat<BusinessProcessResponse>> {
    const dataQuery = QueryConstructor.constructQuery<BusinessProcessEntity>(
      this.businessProcessRepository,
      query,
    );
    const response = new DataResponseFormat<BusinessProcessResponse>();
    if (query.count) {
      response.total = await dataQuery.getCount();
    } else {
      const [result, total] = await dataQuery.getManyAndCount();
      response.total = total;
      response.items = result.map((entity) =>
        BusinessProcessResponse.toResponse(entity),
      );
    }
    return response;
  }
  async getById(id: string): Promise<BusinessProcessResponse> {
    const businessProcess = await this.businessProcessRepository.findOne({
      where: { id: id },
    });
    if (!businessProcess)
      throw new NotFoundException('Business Process not found');
    return BusinessProcessResponse.toResponse(businessProcess);
  }
  async create(
    dto: CreateBusinessProcessDto,
  ): Promise<BusinessProcessResponse> {
    const businessProcessEntity = CreateBusinessProcessDto.fromDto(dto);
    console.log(businessProcessEntity, dto);
    const newService = await this.businessProcessRepository.save(
      businessProcessEntity,
    );
    return BusinessProcessResponse.toResponse(newService);
  }
  async update(
    dto: UpdateBusinessProcessDto,
  ): Promise<BusinessProcessResponse> {
    const businessProcess = await this.businessProcessRepository.findOne({
      where: { id: dto.id },
    });
    if (!businessProcess)
      throw new NotFoundException('Business Process not found');
    businessProcess.serviceId = dto.serviceId;
    businessProcess.version = dto.version;
    businessProcess.workflow = dto.workflow;
    businessProcess.isActive = dto.isActive;
    const result = await this.businessProcessRepository.save(businessProcess);
    return BusinessProcessResponse.toResponse(result);
  }
  async delete(id: string): Promise<any> {
    const businessProcess = await this.businessProcessRepository.findOne({
      where: { id: id },
    });
    if (!businessProcess)
      throw new NotFoundException('Business Process not found');
    return await this.businessProcessRepository.delete(id);
  }
}
