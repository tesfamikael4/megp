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
import { CollectionQuery } from '../collection-query';
import { DataResponseFormat } from '../api-data';
import { BaseEntity } from '../entities/base.entity';
import { GenericBulkCrudService } from '../service/generic-bulk-crud.service';

@Controller()
@UseInterceptors(/* your interceptors if any */)
export class GenericBulkCrudController<TEntity extends BaseEntity> {
  constructor(private readonly service: GenericBulkCrudService<TEntity>) {}

  @Post()
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
