import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GenericBulkCrudController } from 'src/shared/controller/generic-bulk-crud.controller';
import { UserGroupBulkService } from '../services/group-bulk.service';
import { UserGroup } from '../entity/user-group.entity';
import { BulkCrudDecorator, CrudDecorator } from 'src/shared/decorators/crud-options.decorator';
import { CollectionQuery } from 'src/shared/collection-query';
import { DataResponseFormat } from 'src/shared/api-data';

@BulkCrudDecorator({
  firstEntityIdName: 'groupId',
  firstInclude: 'user',
  secondEntityIdName: 'userId',
  secondInclude: 'group'
})
@Controller('user-groups')
@ApiTags('user-groups')
export class UserGroupController extends GenericBulkCrudController<UserGroup> {
  constructor(
    private readonly groupService: UserGroupBulkService) {
    super(groupService);
  }

  @Get(':id/user')
  async findAllFirst(
    @Param('id') id: string,
    @Query() query: CollectionQuery,
    @Req() req?: any
  ): Promise<DataResponseFormat<UserGroup>> {
    const crudOptions = Reflect.getMetadata('crudOptions', this.constructor);

    return super.findAllFirst(id, query, crudOptions);
  }

  @Get(':id/group')
  async findAllSecond(
    @Param('id') id: string,
    @Query() query: CollectionQuery,
    @Req() req?: any
  ): Promise<DataResponseFormat<UserGroup>> {
    const crudOptions = Reflect.getMetadata('crudOptions', this.constructor);

    return super.findAllSecond(id, query, crudOptions);
  }
}
