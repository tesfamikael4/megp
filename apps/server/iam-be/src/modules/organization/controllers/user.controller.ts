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
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';

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
}
