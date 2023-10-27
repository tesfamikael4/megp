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

export function RelationCrudController<
  TEntity extends BaseEntity,
  TCreateFirstDto = NonNullable<unknown>,
  TCreateSecondDto = NonNullable<unknown>,
>(
  first = 'first',
  second = 'second',
  createFirstDto?: { new (): TCreateFirstDto },
  createSecondDto?: { new (): TCreateSecondDto },
) {
  @Controller()
  @UseInterceptors(/* your interceptors if any */)
  @ApiBearerAuth()
  class RelationCrudControllerHost {
    constructor(public readonly service: RelationCrudService<TEntity>) {}

    @Post(`assign-${first}`)
    @ApiBody({ type: createFirstDto || BaseAPIDto })
    async bulkSaveFirst(@Body() itemData: any, @Req() req?: any): Promise<any> {
      const crudOptions = Reflect.getMetadata('crudOptions', this.constructor);

      return this.service.bulkSaveFirst(itemData, crudOptions);
    }

    @Post(`assign-${second}`)
    @ApiBody({ type: createSecondDto || BaseAPIDto })
    async bulkSaveSecond(
      @Body() itemData: any,
      @Req() req?: any,
    ): Promise<any> {
      const crudOptions = Reflect.getMetadata('crudOptions', this.constructor);

      return this.service.bulkSaveSecond(itemData, crudOptions);
    }

    @Get(`:id/${first}`)
    async findAllFirst(
      @Param('id') id: string,
      @Query() query: CollectionQuery,
      @Req() req?: any,
    ): Promise<DataResponseFormat<TEntity>> {
      const crudOptions = Reflect.getMetadata('crudOptions', this.constructor);

      return this.service.findAllFirst(id, query, crudOptions);
    }

    @Get(`:id/${second}`)
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
