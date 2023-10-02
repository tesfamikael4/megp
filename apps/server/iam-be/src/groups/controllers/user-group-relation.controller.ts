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
import { UserGroup } from '../entity/user-group.entity';
import { CrudDecorator } from 'src/shared/decorators/crud-options.decorator';
import { CollectionQuery } from 'src/shared/collection-query';
import { DataResponseFormat } from 'src/shared/api-data';
import { GenericRelationCrudController } from 'src/shared/controller/generic-relation-crud.controller';
import { UserGroupRelationService } from '../services/group-bulk-relation.service';

@CrudDecorator({
  entityIdName: 'groupId',
})
@Controller('user-group-relations')
@ApiTags('user-group-relations')
export class UserGroupRelationController extends GenericRelationCrudController<UserGroup> {
  constructor(
    private readonly groupService: UserGroupRelationService) {
    super(groupService);
  }


  // @Get(':id')
  // async findAllFirst(
  //   @Param('id') id: string,
  //   @Query() query: CollectionQuery,
  //   @Req() req?: any
  // ): Promise<DataResponseFormat<UserGroup>> {
  //   const crudOptions = Reflect.getMetadata('crudOptions', this.constructor);

  //   return super.findAll(id, query, crudOptions);
  // }
}
