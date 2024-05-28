import { Body, Controller, Get, Param, Post, Query, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Tender } from 'src/entities';
import { EntityCrudController } from 'src/shared/controller';
import { EntityCrudOptions } from 'src/shared/types/crud-option.type';
import { TenderService } from '../service/tender.service';
import {
  ChangeTenderStatusDto,
  CreateTenderDto,
  GenerateTenderDocumentDto,
} from '../dto/tender.dto';
import { decodeCollectionQuery } from 'src/shared/collection-query';
import { AllowAnonymous } from 'src/shared/authorization';
import { Payload } from '@nestjs/microservices';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { ConsumeMessage } from 'amqplib';

const options: EntityCrudOptions = {
  createDto: CreateTenderDto,
};

@ApiBearerAuth()
@Controller('tenders')
@ApiTags('Tender Controller')
export class TenderController extends EntityCrudController<Tender>(options) {
  constructor(private readonly tenderService: TenderService) {
    super(tenderService);
  }

  @RabbitSubscribe({
    exchange: 'workflow-broadcast-exchanges',
    routingKey: 'tendering.approval',
    queue: 'tendering',
    errorHandler: (err) => {
      console.error('🚀 ~ TenderController ~ err:', err);
    },
  })
  @AllowAnonymous()
  async tenderApproval(data: any, amqpMsg: ConsumeMessage) {
    if (amqpMsg.fields.routingKey == 'tendering.approval') {
      return this.tenderService.tenderApproval(data);
    }
  }

  @Get('active-tenders')
  @ApiQuery({
    name: 'q',
    type: String,
    description: 'Collection Query Parameter. Optional',
    required: false,
  })
  @AllowAnonymous()
  async getActiveTenders(@Query('q') q?: string) {
    const query = decodeCollectionQuery(q);
    return await this.tenderService.getActiveTenders(query);
  }

  @Get('closed-tenders')
  @ApiQuery({
    name: 'q',
    type: String,
    description: 'Collection Query Parameter. Optional',
    required: false,
  })
  async getClosedTenders(@Query('q') q?: string, @Req() req?: any) {
    const query = decodeCollectionQuery(q);
    return await this.tenderService.getClosedTenders(query, req);
  }

  @Get('re-advertise-tenders')
  @ApiQuery({
    name: 'q',
    type: String,
    description: 'Collection Query Parameter. Optional',
    required: false,
  })
  async getReAdvertiseTenders(@Query('q') q?: string, @Req() req?: any) {
    const query = decodeCollectionQuery(q);
    return await this.tenderService.getReAdvertiseTenders(query, req);
  }

  @Post('change-status')
  async changeStatus(@Body() itemData: ChangeTenderStatusDto) {
    return this.tenderService.changeStatus(itemData);
  }

  @Post('generate-tender-document')
  async generateTenderDocument(@Body() itemData: GenerateTenderDocumentDto) {
    return this.tenderService.generateTenderDocument(itemData);
  }

  @Get('download-tender-document/:id')
  async downloadTenderDocument(@Param('id') id: string) {
    return await this.tenderService.downloadTenderDocument(id);
  }

  @Post('generate-invitation-document')
  async generateTenderInvitation(@Body() itemData: GenerateTenderDocumentDto) {
    return this.tenderService.generateTenderInvitation(itemData);
  }

  @Get('download-invitation-document/:id')
  @AllowAnonymous()
  async downloadInvitationDocument(@Param('id') id: string) {
    return await this.tenderService.downloadTenderInvitation(id);
  }
}
