import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  CreateUserProfileDto,
  UpdateUserProfileDto,
} from '../dto/user-profile.dto';
import { UserProfile } from '@entities';
import { UserProfileService } from '../services/user-profile.service';
import { ExtraCrudController } from 'src/shared/controller/extra-crud.controller';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';

const options: ExtraCrudOptions = {
  entityIdName: 'userId',
  createDto: CreateUserProfileDto,
  updateDto: UpdateUserProfileDto,
};

@Controller('user-profile')
@ApiTags('user-profile')
export class UserProfileController extends ExtraCrudController<UserProfile>(
  options,
) {
  constructor(private readonly userService: UserProfileService) {
    super(userService);
  }
}
