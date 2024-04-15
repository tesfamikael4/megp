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
import { DeepPartial, ObjectLiteral } from 'typeorm';
import { DataResponseFormat } from '../api-data';
import { ExtraCrudService } from '../service';
import { ApiBearerAuth, ApiBody, ApiQuery } from '@nestjs/swagger';
import { ExtraCrudOptions } from '../types/crud-option.type';
import { decodeCollectionQuery } from '../collection-query';

export class BaseAPIDto {}

export function ExtraCrudController<TEntity extends ObjectLiteral>(
  options: ExtraCrudOptions,
) {
  const { createDto, updateDto } = options;

  @Controller()
  @UseInterceptors()
  @ApiBearerAuth()
  class ExtraCrudControllerHost {
    constructor(public readonly service: ExtraCrudService<TEntity>) {}

    @Post()
    @ApiBody({ type: createDto || BaseAPIDto })
    async create(
      @Body() itemData: DeepPartial<TEntity>,
      @Req() req?: any,
    ): Promise<TEntity> {
      return this.service.create(itemData, req);
    }

    @Get('list/:id')
    @ApiQuery({
      name: 'q',
      type: String,
      description: 'Collection Query Parameter. Optional',
      required: false,
    })
    async findAll(
      @Param('id') id: string,
      @Query('q') q: string,
      @Req() req?: any,
    ): Promise<DataResponseFormat<TEntity>> {
      const query = decodeCollectionQuery(q);
      return this.service.findAll(id, query, options, req);
    }

    @Get(':id')
    async findOne(
      @Param('id') id: string,
      @Req() req?: any,
    ): Promise<TEntity | undefined> {
      return this.service.findOne(id, req);
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
    async delete(@Param('id') id: string, @Req() req?: any): Promise<void> {
      return this.service.delete(id);
    }
  }

  return ExtraCrudControllerHost;
}
