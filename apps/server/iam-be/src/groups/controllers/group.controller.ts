import { GenericCrudController } from 'src/shared/controller/generic-crud.controller';
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
import { AllowAnonymous, AuthGuard } from 'src/supertokens';
import { CreateGroupDto, UpdateGroupDto } from '../dto/group.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('groups')
@ApiTags('groups')
export class GroupController extends GenericCrudController<Group> {
  constructor(private readonly groupService: GroupService) {
    super(groupService);
  }

  @Get()
  @AllowAnonymous()
  async findAll(
    @Query() query: CollectionQuery,
  ): Promise<DataResponseFormat<Group>> {
    return await super.findAll(query);
  }

  @Post()
  async create(@Body() itemData: CreateGroupDto): Promise<Group> {
    return await super.create(itemData);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateItemDto: UpdateGroupDto,
  ): Promise<Group | undefined> {
    return await super.update(id, updateItemDto);
  }
}
