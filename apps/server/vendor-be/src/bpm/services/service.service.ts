import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BpServiceEntity } from './entities/bp-service';
import { Repository } from 'typeorm';
import { BpServiceResponse } from './bp-service.response';
import { DataResponseFormat } from 'src/shared/api-data';
import { CollectionQuery, QueryConstructor } from 'src/shared/collection-query';
import { CreateBpServiceDto, UpdateBpServiceDto } from './dtos/bp-service.dto';

@Injectable()
export class BpServiceService {
  constructor(
    @InjectRepository(BpServiceEntity)
    private readonly serviceRepository: Repository<BpServiceEntity>,
  ) {}
  async getServices(
    query: CollectionQuery,
  ): Promise<DataResponseFormat<BpServiceResponse>> {
    const dataQuery = QueryConstructor.constructQuery<BpServiceEntity>(
      this.serviceRepository,
      query,
    );
    const response = new DataResponseFormat<BpServiceResponse>();
    if (query.count) {
      response.total = await dataQuery.getCount();
    } else {
      const [result, total] = await dataQuery.getManyAndCount();
      response.total = total;
      response.items = result.map((entity) =>
        BpServiceResponse.toResponse(entity),
      );
    }
    return response;
  }
  async getById(id: string): Promise<BpServiceResponse> {
    const service = await this.serviceRepository.findOne({ where: { id: id } });
    if (!service) throw new NotFoundException('Service not found');
    return BpServiceResponse.toResponse(service);
  }
  async create(dto: CreateBpServiceDto): Promise<BpServiceResponse> {
    const serviceEntity = CreateBpServiceDto.fromDto(dto);
    const newService = await this.serviceRepository.save(serviceEntity);
    return BpServiceResponse.toResponse(newService);
  }
  async update(dto: UpdateBpServiceDto): Promise<BpServiceResponse> {
    const service = await this.serviceRepository.findOne({
      where: { id: dto.id },
    });
    if (!service) throw new NotFoundException('Service not found');
    service.name = dto.name;
    service.description = dto.description;
    service.isActive = dto.isActive;
    const result = await this.serviceRepository.save(service);
    return BpServiceResponse.toResponse(result);
  }
  async delete(id: string): Promise<any> {
    const service = await this.serviceRepository.findOne({ where: { id: id } });
    if (!service) throw new NotFoundException('Service not found');
    return await this.serviceRepository.delete(id);
  }
}
