import {
  Body,
  Controller,
  Post,
  Put,
  Param,
  ParseUUIDPipe,
  HttpStatus,
  Get,
  Query,
} from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { UserService } from '../services/user.service';
import { User } from '@entities';
import { CreateUserDto, InviteUserDto, UpdateUserDto } from '../dto/user.dto';
import { ExtraCrudController } from 'src/shared/controller/extra-crud.controller';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { decodeCollectionQuery } from 'src/shared/collection-query/query-mapper';

const options: ExtraCrudOptions = {
  entityIdName: 'organizationId',
  createDto: CreateUserDto,
  updateDto: UpdateUserDto,
};

@Controller('user')
@ApiTags('user')
export class UserController extends ExtraCrudController<User>(options) {
  constructor(private readonly userService: UserService) {
    super(userService);
  }

  @Post()
  @ApiBody({ type: CreateUserDto })
  async create(@Body() itemData: CreateUserDto): Promise<any> {
    return this.userService.create(itemData);
  }

  @Post('create-organization-admin')
  @ApiBody({ type: CreateUserDto })
  async createOrganizationAdmin(@Body() itemData: CreateUserDto): Promise<any> {
    return this.userService.createOrganizationAdmin(itemData);
  }

  @Post('invite')
  @ApiBody({ type: InviteUserDto })
  async invite(@Body() itemData: InviteUserDto): Promise<any> {
    return this.userService.sendInvitation(itemData);
  }

  @Get('invitation/:id')
  async getInvitation(@Param('id') id: string): Promise<any> {
    return this.userService.getInvitation(id);
  }

  @Get('test')
  async test(@Query('q') q: string) {
    console.log(q);
    return decodeCollectionQuery(q);
  }
}
