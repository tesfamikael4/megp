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
import {
  CreateUserProfileDto,
  UpdateUserProfileDto,
} from '../dto/user-profile.dto';
import { UserProfile } from '../entities/user-profile.entity';
import { UserProfileService } from '../services/user-profile.service';
import { ExtraCrudController } from 'src/shared/controller/extra-crud.controller';
import { ExtraCrudDecorator } from 'src/shared/decorators/crud-options.decorator';

@ExtraCrudDecorator({
  entityIdName: 'userId',
})
@Controller('user-profile')
@ApiTags('user-profile')
export class UserProfileController extends ExtraCrudController<UserProfile>() {
  constructor(private readonly userService: UserProfileService) {
    super(userService);
  }

  @Post()
  async create(
    @Body() createUserProfileDto: CreateUserProfileDto,
  ): Promise<UserProfile> {
    return await super.create(createUserProfileDto);
  }

  @Put(':id')
  async update(
    @Param(
      'id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: string,
    @Body() updateUserProfileDto: UpdateUserProfileDto,
  ): Promise<UserProfile | undefined> {
    return await super.update(id, updateUserProfileDto);
  }
}
