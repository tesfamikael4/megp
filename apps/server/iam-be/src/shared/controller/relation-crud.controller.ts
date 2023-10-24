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
import { ApiBody } from '@nestjs/swagger';

export function RelationCrudController<
  TEntity extends BaseEntity,
  TCreateDto = NonNullable<unknown>,
  TUpdateDto = NonNullable<unknown>,
>(createDto?: { new (): TCreateDto }, updateDto?: { new (): TUpdateDto }) {
  @Controller()
  @UseInterceptors(/* your interceptors if any */)
  class RelationCrudControllerHost {
    constructor(public readonly service: RelationCrudService<TEntity>) {}

    @Post()
    @ApiBody({ type: BaseAPIDto })
    async bulkSave(@Body() itemData: any, @Req() req?: any): Promise<any> {
      const crudOptions = Reflect.getMetadata('crudOptions', this.constructor);

      return this.service.bulkSave(itemData, crudOptions);
    }

    @Get(':id/first')
    async findAllFirst(
      @Param('id') id: string,
      @Query() query: CollectionQuery,
      @Req() req?: any,
    ): Promise<DataResponseFormat<TEntity>> {
      const crudOptions = Reflect.getMetadata('crudOptions', this.constructor);

      return this.service.findAllFirst(id, query, crudOptions);
    }

    @Get(':id/second')
    async findAllSecond(
      @Param('id') id: string,
      @Query() query: CollectionQuery,
      @Req() req?: any,
    ): Promise<DataResponseFormat<TEntity>> {
      const crudOptions = Reflect.getMetadata('crudOptions', this.constructor);

      return this.service.findAllSecond(id, query, crudOptions);
    }
  }

  return RelationCrudControllerHost;
}
