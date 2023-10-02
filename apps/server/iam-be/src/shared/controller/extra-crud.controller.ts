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
  Req,
} from '@nestjs/common';
import { DeepPartial } from 'typeorm';
import { CollectionQuery } from '../collection-query';
import { DataResponseFormat } from '../api-data';
import { BaseEntity } from '../entities/base.entity';
import { ExtraCrudService } from '../service/extra-crud.service';

@Controller()
@UseInterceptors(/* your interceptors if any */)
export class ExtraCrudController<TEntity extends BaseEntity> {
  constructor(private readonly service: ExtraCrudService<TEntity>) { }

  @Post()
  async create(@Body() itemData: DeepPartial<TEntity>, @Req() req?: any): Promise<TEntity> {
    return this.service.create(itemData);
  }

  @Get('list/:id')
  async findAll(
    @Param('id') id: string,
    @Query() query: CollectionQuery,
    @Req() req?: any
  ): Promise<DataResponseFormat<TEntity>> {
    const crudOptions = Reflect.getMetadata('crudOptions', this.constructor);

    return this.service.findAll(id, query, crudOptions);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req?: any): Promise<TEntity | undefined> {
    return this.service.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() itemData: Partial<TEntity>,
    @Req() req?: any
  ): Promise<TEntity | undefined> {
    return this.service.update(id, itemData);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req?: any): Promise<void> {
    return this.service.remove(id);
  }
}
