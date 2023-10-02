// src/items/items.controller.ts

import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
} from '@nestjs/common';
import { ItemsService } from './items.service';
import { Todo } from './entities/todo.entity';
import { AllowAnonymous } from 'src/authorization';
import { CreateTodoDto, UpdateTodoDto } from './dto/todo.dto';
import { EntityCrudController } from 'src/shared/controller/generic-crud.controller';
import { CollectionQuery } from 'src/shared/collection-query';
import { DataResponseFormat } from 'src/shared/api-data';
import { ApiTags } from '@nestjs/swagger';

@Controller('items')
@ApiTags('Items')
export class ItemsController extends EntityCrudController<Todo> {
  constructor(private readonly itemsService: ItemsService) {
    super(itemsService);
  }

  @Get()
  @AllowAnonymous()
  async findAll(
    @Query() query: CollectionQuery,
  ): Promise<DataResponseFormat<Todo>> {
    return await super.findAll(query);
  }

  @Post()
  @AllowAnonymous()
  async create(@Body() itemData: CreateTodoDto): Promise<Todo> {
    return await super.create(itemData);
  }
}
