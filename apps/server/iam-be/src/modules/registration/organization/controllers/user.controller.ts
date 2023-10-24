import {
  Body,
  Controller,
  Post,
  Put,
  Param,
  ParseUUIDPipe,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from '../services/user.service';
import { User } from '../entities/user.entity';
import { CreateUserDto, UpdateUserDto } from '../dto/user.dto';
import { ExtraCrudController } from 'src/shared/controller/extra-crud.controller';
import { ExtraCrudDecorator } from 'src/shared/decorators/crud-options.decorator';
@ExtraCrudDecorator({
  entityIdName: 'organizationId',
})
@Controller('user')
@ApiTags('user')
export class UserController extends ExtraCrudController<User> {
  constructor(private readonly userService: UserService) {
    super(userService);
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await super.create(createUserDto);
  }

  @Put(':id')
  async update(
    @Param(
      'id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User | undefined> {
    return await super.update(id, updateUserDto);
  }
}
