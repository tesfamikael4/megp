import { Controller, Get, Param, Query, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RelationCrudController } from 'src/shared/controller/relation-crud.controller';
import { UserGroupBulkService } from '../services/group-bulk.service';
import { UserGroup } from '../entity/user-group.entity';
import { RelationCrudDecorator } from 'src/shared/decorators/crud-options.decorator';
import { CollectionQuery } from 'src/shared/collection-query';
import { DataResponseFormat } from 'src/shared/api-data';

@RelationCrudDecorator({
  firstEntityIdName: 'groupId',
  firstInclude: 'user',
  secondEntityIdName: 'userId',
  secondInclude: 'group',
})
@Controller('relation-user-groups')
@ApiTags('relation-user-groups')
export class UserGroupController extends RelationCrudController<UserGroup> {
  constructor(private readonly groupService: UserGroupBulkService) {
    super(groupService);
  }

  @Get(':id/user')
  async findAllFirst(
    @Param('id') id: string,
    @Query() query: CollectionQuery,
    @Req() req?: any,
  ): Promise<DataResponseFormat<UserGroup>> {
    const crudOptions = Reflect.getMetadata('crudOptions', this.constructor);

    return super.findAllFirst(id, query, crudOptions);
  }

  @Get(':id/group')
  async findAllSecond(
    @Param('id') id: string,
    @Query() query: CollectionQuery,
    @Req() req?: any,
  ): Promise<DataResponseFormat<UserGroup>> {
    const crudOptions = Reflect.getMetadata('crudOptions', this.constructor);

    return super.findAllSecond(id, query, crudOptions);
  }
}
