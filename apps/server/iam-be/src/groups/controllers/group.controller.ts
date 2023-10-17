import { EntityCrudController } from 'src/shared/controller/entity-crud.controller';
import { Group } from '../entity/group.entity';
import { GroupService } from '../services/group.service';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { DataResponseFormat } from 'src/shared/api-data';
import { CollectionQuery } from 'src/shared/collection-query';
import { CreateGroupDto, UpdateGroupDto } from '../dto/group.dto';
import { ApiTags } from '@nestjs/swagger';
import { CollectionQueryNew } from 'src/shared/collection-query/query';
import { AllowAnonymous } from 'src/modules/authorization/decorators/allow-anonymous.decorator';

@Controller('groups')
@ApiTags('groups')
export class GroupController extends EntityCrudController<Group> {
  constructor(private readonly groupService: GroupService) {
    super(groupService);
  }
}
