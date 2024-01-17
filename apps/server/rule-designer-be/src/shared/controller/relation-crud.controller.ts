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
import { DataResponseFormat } from '../api-data';
import { RelationCrudService } from '../service';
import { BaseAPIDto } from './extra-crud.controller';
import { ApiBearerAuth, ApiBody, ApiQuery } from '@nestjs/swagger';
import { RelationCrudOptions } from '../types/crud-option.type';
import { ObjectLiteral } from 'typeorm';
import { decodeCollectionQuery } from '../collection-query';

export function RelationCrudController<TEntity extends ObjectLiteral>(
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
    @ApiQuery({
      name: 'q',
      type: String,
      description: 'Collection Query Parameter. Optional',
      required: false,
    })
    async findAllFirst(
      @Param('id') id: string,
      @Query('q') q: string,
      @Req() req?: any,
    ): Promise<DataResponseFormat<TEntity>> {
      const query = decodeCollectionQuery(q);
      return this.service.findAllFirst(id, query, options);
    }

    @Get(`:id/${secondInclude}`)
    @ApiQuery({
      name: 'q',
      type: String,
      description: 'Collection Query Parameter. Optional',
      required: false,
    })
    async findAllSecond(
      @Param('id') id: string,
      @Query('q') q: string,
      @Req() req?: any,
    ): Promise<DataResponseFormat<TEntity>> {
      const query = decodeCollectionQuery(q);
      return this.service.findAllSecond(id, query, options);
    }
  }

  return RelationCrudControllerHost;
}
