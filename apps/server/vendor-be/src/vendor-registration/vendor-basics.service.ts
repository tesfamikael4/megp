import { InjectRepository } from '@nestjs/typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CollectionQuery, QueryConstructor } from '@collection-query';
import { DataResponseFormat } from '@api-data';
import { VendorsEntity } from './entities/vendors.entity';
import {
  CreateVendorsDto,
  UpdateVendorsDto,
  VendorsResponseDto,
} from './dto/vendor.dto';
@Injectable()
export class VendorBasicsService {
  constructor(
    @InjectRepository(VendorsEntity)
    private readonly repository: Repository<VendorsEntity>,
  ) {}

  async create(dto: CreateVendorsDto): Promise<VendorsResponseDto> {
    try {
      const entity = CreateVendorsDto.fromDto(dto);
      entity.createdBy = 'b920fb64-fe56-49d8-9411-a9470b37270a';
      console.log(entity);
      await this.repository.save(entity);
      return VendorsResponseDto.fromEntity(entity);
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async update(id: string, dto: UpdateVendorsDto): Promise<VendorsResponseDto> {
    try {
      dto.id = id;
      const entity = UpdateVendorsDto.fromDto(dto);
      await this.repository.update({ id: dto.id }, entity);
      return VendorsResponseDto.fromEntity(entity);
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
  /*
  fetch all applications of vendors
  */
  async findAll(query: CollectionQuery) {
    try {
      const dataQuery = QueryConstructor.constructQuery<VendorsEntity>(
        this.repository,
        query,
      );
      const response = new DataResponseFormat<VendorsResponseDto>();
      if (query.count) {
        response.total = await dataQuery.getCount();
      } else {
        const [result, total] = await dataQuery.getManyAndCount();
        response.total = total;
        response.items = result.map((entity) =>
          VendorsResponseDto.fromEntity(entity),
        );
      }
      return response;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
  /*
  fetch  applications of vendor by Id
  */
  async findOne(id: string): Promise<VendorsResponseDto> {
    try {
      const entity = await this.repository.findOne({ where: { id } });
      return VendorsResponseDto.fromEntity(entity);
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
