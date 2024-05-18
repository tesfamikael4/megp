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
  Patch,
} from '@nestjs/common';
import { EntityCrudService } from '../service';
import { DeepPartial, ObjectLiteral } from 'typeorm';
import { DataResponseFormat } from '../api-data';
import { ApiBearerAuth, ApiBody, ApiQuery } from '@nestjs/swagger';
import { BaseAPIDto } from './extra-crud.controller';
import { EntityCrudOptions } from '../types/crud-option.type';
import { decodeCollectionQuery } from '../collection-query';

export function EntityCrudController<TEntity extends ObjectLiteral>(
  options?: EntityCrudOptions,
) {
  @Controller()
  @UseInterceptors(/* your interceptors if any */)
  @ApiBearerAuth()
  class EntityCrudControllerHost {
    constructor(public readonly service: EntityCrudService<TEntity>) {}

    @Post()
    @ApiBody({ type: options?.createDto || BaseAPIDto })
    async create(
      @Body() itemData: DeepPartial<TEntity>,
      @Req() req?: any,
    ): Promise<TEntity> {
      return this.service.create(itemData, req);
    }

    @Get()
    @ApiQuery({
      name: 'q',
      type: String,
      description: 'Collection Query Parameter. Optional',
      required: false,
    })
    async findAll(
      @Query('q') q?: string,
      @Req() req?: any,
    ): Promise<DataResponseFormat<TEntity>> {
      const query = decodeCollectionQuery(q);
      return this.service.findAll(query, req);
    }

    @Get(':id')
    async findOne(
      @Param('id') id: string,
      @Req() req?: any,
    ): Promise<TEntity | undefined> {
      return this.service.findOne(id, req);
    }

    @Put(':id')
    @ApiBody({ type: options?.updateDto || BaseAPIDto })
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

    @Patch('restore/:id')
    async restore(@Param('id') id: string, @Req() req?: any): Promise<void> {
      return this.service.restore(id);
    }

    @Get('/archived/items')
    @ApiQuery({
      name: 'q',
      type: String,
      description: 'Collection Query Parameter. Optional',
      required: false,
    })
    async findAllArchived(
      @Query('q') q?: string,
      @Req() req?: any,
    ): Promise<DataResponseFormat<TEntity>> {
      const query = decodeCollectionQuery(q);
      return this.service.findAllArchived(query);
    }
  }

  return EntityCrudControllerHost;
}
