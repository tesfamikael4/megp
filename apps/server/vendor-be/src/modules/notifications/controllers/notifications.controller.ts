import {
  Body,
  Controller,
  Post,
  Param,
  Patch,
  HttpStatus,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { DataResponseFormat } from '@api-data';

import { EntityCrudController } from 'src/shared/controller';
import { EntityCrudOptions } from 'src/shared/types/crud-option.type';
import { JwtGuard } from 'src/shared/authorization';
import {
  CreateNotifcationDto,
  UpdateNotifcationDto,
} from '../dto/notification.dto';
import { NotificationsService } from '../services/notification.service';
import { Notification } from 'src/entities/notification.entity';
const options: EntityCrudOptions = {
  createDto: CreateNotifcationDto,
  updateDto: UpdateNotifcationDto,
};
@ApiBearerAuth()
@Controller('notifications')
@UseGuards(JwtGuard)
@ApiTags('Notifications')
@ApiResponse({ status: 500, description: 'Internal error' })
@ApiExtraModels(DataResponseFormat)
export class NotificationsController extends EntityCrudController<Notification>(
  options,
) {
  constructor(private readonly notificationService: NotificationsService) {
    super(notificationService);
  }

  @Post()
  async create(@Body() dto: CreateNotifcationDto) {
    return await super.create(dto);
  }

  @Patch(':id')
  async update(
    @Param(
      'id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: string,
    @Body() updateDto: UpdateNotifcationDto,
  ) {
    return await super.update(id, updateDto);
  }
}
