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
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { ExtraCrudOptions } from '../types/crud-option.type';
import { decodeCollectionQuery } from '../collection-query/query-mapper';

export class BaseAPIDto {}

export function ExtraCrudController<TEntity extends BaseEntity>(
  options: ExtraCrudOptions,
) {
  const { entityIdName, createDto, updateDto } = options;

  @Controller()
  @UseInterceptors(/* your interceptors if any */)
  @ApiBearerAuth()
  class ExtraCrudControllerHost {
    constructor(public readonly service: ExtraCrudService<TEntity>) {}

    @Post()
    @ApiBody({ type: createDto || BaseAPIDto })
    async create(
      @Body() itemData: DeepPartial<TEntity>,
      @Req() req?: any,
    ): Promise<TEntity> {
      return this.service.create(itemData);
    }

    @Get('list/:id')
    async findAll(
      @Param('id') id: string,
      @Query('q') q: string,
      @Req() req?: any,
    ): Promise<DataResponseFormat<TEntity>> {
      const query = decodeCollectionQuery(q);
      return this.service.findAll(id, query, options);
    }

    @Get(':id')
    async findOne(
      @Param('id') id: string,
      @Req() req?: any,
    ): Promise<TEntity | undefined> {
      return this.service.findOne(id);
    }

    @Put(':id')
    @ApiBody({ type: updateDto || BaseAPIDto })
    async update(
      @Param('id') id: string,
      @Body() itemData: Partial<TEntity>,
      @Req() req?: any,
    ): Promise<TEntity | undefined> {
      return this.service.update(id, itemData);
    }

    @Delete(':id')
    async softDelete(@Param('id') id: string, @Req() req?: any): Promise<void> {
      return this.service.softDelete(id);
    }
  }

  return ExtraCrudControllerHost;
}
