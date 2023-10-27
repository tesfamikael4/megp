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
import { EntityCrudService } from '../service/entity-crud.service';
import { DeepPartial } from 'typeorm';
import { CollectionQuery } from '../collection-query';
import { DataResponseFormat } from '../api-data';
import { BaseEntity } from '../entities/base.entity';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { BaseAPIDto } from './extra-crud.controller';

export function EntityCrudController<
  TEntity extends BaseEntity,
  TCreateDto = NonNullable<unknown>,
  TUpdateDto = NonNullable<unknown>,
>(createDto?: { new (): TCreateDto }, updateDto?: { new (): TUpdateDto }) {
  @Controller()
  @UseInterceptors(/* your interceptors if any */)
  @ApiBearerAuth()
  class EntityCrudControllerHost {
    constructor(public readonly service: EntityCrudService<TEntity>) {}

    @Post()
    @ApiBody({ type: createDto || BaseAPIDto })
    async create(
      @Body() itemData: DeepPartial<TEntity>,
      @Req() req?: any,
    ): Promise<TEntity> {
      return this.service.create(itemData);
    }

    @Get()
    async findAll(
      @Query() query: CollectionQuery,
      @Req() req?: any,
    ): Promise<DataResponseFormat<TEntity>> {
      return this.service.findAll(query);
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
    async remove(@Param('id') id: string, @Req() req?: any): Promise<void> {
      return this.service.remove(id);
    }
  }

  return EntityCrudControllerHost;
}
