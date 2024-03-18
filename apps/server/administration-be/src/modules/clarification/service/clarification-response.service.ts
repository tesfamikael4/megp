import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { ClarificationRequest } from 'src/entities/clarification-request.entity';
import { ClarificationResponse } from 'src/entities/clarification-response.entity';
import { MinIOService } from 'src/shared/min-io/min-io.service';
import { EntityCrudService } from 'src/shared/service';
import {
  NotificationStatusEnum,
  NotificationTypeEnum,
  SendNotificationEvent,
} from 'src/shared/types/notification.type';
import { Repository } from 'typeorm';
import { CreateClarificationResponseDTO } from '../dto/clarification-response.dto';
import {
  CollectionQuery,
  FilterOperators,
  QueryConstructor,
} from 'src/shared/collection-query';
import { DataResponseFormat } from 'src/shared/api-data';

@Injectable()
export class ClarificationResponseService extends EntityCrudService<ClarificationResponse> {
  constructor(
    @InjectRepository(ClarificationResponse)
    private readonly repositoryClarificationResponse: Repository<ClarificationResponse>,
    @InjectRepository(ClarificationRequest)
    private readonly repositoryClarificationRequest: Repository<ClarificationRequest>,
    @Inject('NOTIFICATION_SERVICE')
    private readonly notificationClient: ClientProxy,
    private readonly minIOService: MinIOService,
  ) {
    super(repositoryClarificationResponse);
  }

  async create(
    itemData: CreateClarificationResponseDTO,
    req?: any,
  ): Promise<any> {
    const item = this.repositoryClarificationResponse.create(itemData);

    let preSignedUrl: any;

    if (item?.fileInfo && item.fileInfo?.originalName) {
      preSignedUrl = await this.minIOService.generatePresignedUploadUrl({
        ...itemData.fileInfo,
        bucketName: 'megp',
      });
      item.fileInfo = preSignedUrl.file;
    }
    const savedItem = await this.repositoryClarificationResponse.save(item);

    const clarificationRequests =
      await this.repositoryClarificationRequest.find({
        where: {
          clarificationResponseId: savedItem.id,
        },
      });

    const receivers = [];
    clarificationRequests.forEach((request) => {
      receivers.push(request.requesterEmail);
    });

    const emailBody = `Clarification Request: \nQuestion: ${item.rephrasedQuestion} \n\nResponse: ${item.response}`;

    const sendNotificationEmail: SendNotificationEvent = {
      type: NotificationTypeEnum.EMAIL,
      application: 'administration',
      subject: `Clarification`,
      detailContent: emailBody,
      receivers,
    };

    this.notificationClient.emit('send-notification', sendNotificationEmail);
    return { ...savedItem, preSignedUrl: preSignedUrl?.presignedUrl };
  }

  async getDocumentsPresignedUrl(id: string) {
    const clarificationResponse =
      await this.repositoryClarificationResponse.findOne({
        where: { id },
      });

    if (!clarificationResponse)
      throw new NotFoundException('no_request_with_this_id');

    if (!clarificationResponse.fileInfo)
      throw new NotFoundException('no_file_uploaded');

    const preSignedUrl = await this.minIOService.generatePresignedDownloadUrl(
      clarificationResponse.fileInfo,
    );

    return { preSignedUrl };
  }

  async getMyResponses(userId: string, query: CollectionQuery) {
    query.where.push([
      {
        column: 'responderId',
        value: userId,
        operator: FilterOperators.EqualTo,
      },
    ]);
    const dataQuery = QueryConstructor.constructQuery<ClarificationResponse>(
      this.repositoryClarificationResponse,
      query,
    );

    const response = new DataResponseFormat<ClarificationResponse>();
    if (query.count) {
      response.total = await dataQuery.getCount();
    } else {
      const [result, total] = await dataQuery.getManyAndCount();
      response.total = total;
      response.items = result;
    }
    return response;
  }
}
