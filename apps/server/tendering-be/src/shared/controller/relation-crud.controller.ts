import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseInterceptors,
  Query,
  Req,
} from '@nestjs/common';
import { CollectionQuery } from '../collection-query';
import { DataResponseFormat } from '../api-data';
import { BaseEntity } from '../entities/base.entity';
import { RelationCrudService } from '../service/relation-crud.service';
import { BaseAPIDto } from './extra-crud.controller';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { RelationCrudOptions } from '../types/crud-option.type';

export function RelationCrudController<TEntity extends BaseEntity>(
  options: RelationCrudOptions,
) {
  const {
    firstEntityIdName,
    firstInclude = 'first',
    secondEntityIdName,
    secondInclude = 'second',
    assignFirstDto,
    assignSecondDto,
  } = options;

  @Controller()
  @UseInterceptors(/* your interceptors if any */)
  @ApiBearerAuth()
  class RelationCrudControllerHost {
    constructor(public readonly service: RelationCrudService<TEntity>) {}

    @Post(`assign-${firstInclude}`)
    @ApiBody({ type: assignFirstDto || BaseAPIDto })
    async bulkSaveFirst(@Body() itemData: any, @Req() req?: any): Promise<any> {
      return this.service.bulkSaveFirst(itemData, options);
    }

    @Post(`assign-${secondInclude}`)
    @ApiBody({ type: assignSecondDto || BaseAPIDto })
    async bulkSaveSecond(
      @Body() itemData: any,
      @Req() req?: any,
    ): Promise<any> {
      return this.service.bulkSaveSecond(itemData, options);
    }

    @Get(`:id/${firstInclude}`)
    async findAllFirst(
      @Param('id') id: string,
      @Query() query: CollectionQuery,
      @Req() req?: any,
    ): Promise<DataResponseFormat<TEntity>> {
      return this.service.findAllFirst(id, query, options);
    }

    @Get(`:id/${secondInclude}`)
    async findAllSecond(
      @Param('id') id: string,
      @Query() query: CollectionQuery,
      @Req() req?: any,
    ): Promise<DataResponseFormat<TEntity>> {
      return this.service.findAllSecond(id, query, options);
    }
  }

  return RelationCrudControllerHost;
}
