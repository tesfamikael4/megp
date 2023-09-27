import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  Param,
  Patch,
  ParseUUIDPipe,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UserService } from '../services/user.service';
import { CreateUserDto, UpdateUserDto } from '../dto/employee.dto';
import { User } from '../entities/employee.entity';
import {
  CreateUserUnitDto,
  UserUnitResponseDto,
} from '../dto/employee-unit.dto';
import { ApiPaginatedResponse } from 'src/shared/api-data';
import { CollectionQuery } from 'src/shared/collection-query';
import {
  CreateUserRoleDto,
  UserRoleResponseDto,
} from '../dto/employee-role.dto';

@ApiBearerAuth()
@Controller('users')
@ApiTags('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto);
  }

  @Get('get/:id')
  async findOne(
    @Param(
      'id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: string,
    @Query() includes: string[],
    withDeleted: boolean,
  ) {
    return await this.userService.findOne(id, includes, withDeleted);
  }

  @Get('get-all')
  @ApiPaginatedResponse(User)
  @ApiOkResponse({ type: User, isArray: false })
  async findAll(@Query() query: CollectionQuery) {
    return await this.userService.findAll(query);
  }

  @Patch('update/:id')
  async update(
    @Param(
      'id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.userService.update(id, updateUserDto);
  }

  @Delete('delete/:id')
  async remove(@Param('id') id: string) {
    return await this.userService.remove(id);
  }
  @Post('assign-units/:id')
  async assignUnits(
    @Param(
      'id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: string,
    @Body() userUnitResponseDto: CreateUserUnitDto[],
  ) {
    return await this.userService.assignUnits(id, userUnitResponseDto);
  }
  @Patch('activation/:id')
  async activation(
    @Param(
      'id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: string,
  ) {
    return await this.userService.activation(id);
  }
  @Post('assign-roles/:id')
  async assignRoles(
    @Param(
      'id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: string,
    @Body() userRoleResponseDto: CreateUserRoleDto[],
  ) {
    return await this.userService.assignRoles(id, userRoleResponseDto);
  }
}
