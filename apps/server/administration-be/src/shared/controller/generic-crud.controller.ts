import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import { EntityCrudService } from '../service/generic-crud.service';
import { DeepPartial } from 'typeorm';
import { CollectionQuery } from '../collection-query';
import { DataResponseFormat } from '../api-data';
import { BaseEntity } from '../entities/base.entity';

@Controller()
@UseInterceptors(/* your interceptors if any */)
export class EntityCrudController<T extends BaseEntity> {
  constructor(private readonly service: EntityCrudService<T>) {}

  @Post()
  async create(@Body() itemData: DeepPartial<T>): Promise<T> {
    return this.service.create(itemData);
  }

  @Get()
  async findAll(
    @Query() query: CollectionQuery,
  ): Promise<DataResponseFormat<T>> {
    return this.service.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<T | undefined> {
    return this.service.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() itemData: Partial<T>,
  ): Promise<T | undefined> {
    return this.service.update(id, itemData);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.service.remove(id);
  }
}
