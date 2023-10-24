import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserGroup } from '../entity/user-group.entity';
import { ExtraCrudDecorator } from 'src/shared/decorators/crud-options.decorator';
import { ExtraCrudController } from 'src/shared/controller/extra-crud.controller';
import { UserGroupRelationService } from '../services/group-bulk-relation.service';

@ExtraCrudDecorator({
  entityIdName: 'groupId',
})
@Controller('extra-user-groups')
@ApiTags('extra-user-groups')
export class ExtraUserGroupController extends ExtraCrudController<UserGroup> {
  constructor(private readonly groupService: UserGroupRelationService) {
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
