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
export class UserController extends ExtraCrudController<User>(CreateUserDto) {
  constructor(private readonly userService: UserService) {
    super(userService);
  }
}
