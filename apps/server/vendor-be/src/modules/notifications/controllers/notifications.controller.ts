import {
  Body,
  Controller,
  Post,
  Param,
  Patch,
  HttpStatus,
  ParseUUIDPipe,
  UseGuards,
  Get,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiOkResponse,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { DataResponseFormat } from '@api-data';

import { EntityCrudController } from 'src/shared/controller';
import { EntityCrudOptions } from 'src/shared/types/crud-option.type';
import { CurrentUser, JwtGuard } from 'src/shared/authorization';
import {
  CreateNotificationDto,
  UpdateNotificationDto,
} from '../dto/notification.dto';
import { NotificationsService } from '../services/notification.service';
import { Notification } from 'src/entities/notification.entity';
import { decodeCollectionQuery } from 'src/shared/collection-query';
import { BusinessAreaEntity } from 'src/entities';
const options: EntityCrudOptions = {
  createDto: CreateNotificationDto,
  updateDto: UpdateNotificationDto,
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
  async create(@Body() dto: CreateNotificationDto) {
    return await super.create(dto);
  }

  @Patch(':id')
  async update(
    @Param(
      'id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: string,
    @Body() updateDto: UpdateNotificationDto,
  ) {
    return await super.update(id, updateDto);
  }
  @UseGuards(JwtGuard)
  @Get('get-my-notifications')
  @ApiQuery({
    name: 'q',
    type: String,
    required: false,
  })
  @ApiOkResponse({ type: Notification })
  async myNotifications(@Query('q') q: string, @CurrentUser() user: any) {
    const query = decodeCollectionQuery(q);
    // user.id = '90b80f9e-5e23-426f-979a-467b9551fb4b';
    return await this.notificationService.getMyNotifications(user, query);
  }
  //testing API

  @Get('get-vendors-for-notifications')
  @ApiOkResponse({ type: BusinessAreaEntity })
  async vendors() {
    return await this.notificationService.getBusinessAreasWithExpiringLicenses();
  }


}
