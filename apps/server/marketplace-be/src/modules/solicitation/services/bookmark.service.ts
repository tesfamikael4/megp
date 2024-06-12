import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CollectionQuery,
  DataResponseFormat,
  ExtraCrudService,
  FilterOperators,
  QueryConstructor,
} from 'megp-shared-be';
import { RFX, SolBookmark } from 'src/entities';
import { Repository } from 'typeorm';
import { ESolBookmarkStatus } from 'src/utils/enums/sol.enum';
import { ERfxStatus } from 'src/utils/enums';
import { CreateBookmarkDto } from '../dtos/bookmark.dto';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class SolBookmarkService extends ExtraCrudService<SolBookmark> {
  constructor(
    @InjectRepository(SolBookmark)
    private readonly solBookmarkRepository: Repository<SolBookmark>,
    @InjectRepository(RFX)
    private readonly rfxRepository: Repository<RFX>,
    // private readonly amqpConnection: AmqpConnection,
    @Inject('RMS_RMQ_SERVICE')
    private readonly rmsRMQClient: ClientProxy,
  ) {
    super(solBookmarkRepository);
  }

  async create(itemData: CreateBookmarkDto, req: any): Promise<any> {
    const exists = await this.solBookmarkRepository.exists({
      where: {
        rfxId: itemData.rfxId,
        vendorId: req.user?.organization.id,
      },
    });

    if (exists) throw new BadRequestException('RFQ Already Bookmarked');

    const rfx = await this.rfxRepository.findOne({
      where: {
        id: itemData.rfxId,
        status: ERfxStatus.APPROVED,
      },
      relations: {
        rfxBidProcedure: true,
      },
      select: {
        id: true,
        status: true,
        rfxBidProcedure: {
          submissionDeadline: true,
        },
      },
    });

    if (!rfx) throw new BadRequestException('Rfx not found.');

    const now = new Date(Date.now());
    const deadline = new Date(rfx.rfxBidProcedure.submissionDeadline);

    if (now >= deadline)
      throw new BadRequestException('Rfx Submission Deadline Passed');

    itemData.vendorId = req.user?.organization.id;
    const bookmarkData = this.solBookmarkRepository.create(itemData);

    await this.solBookmarkRepository.upsert(bookmarkData, {
      conflictPaths: {
        rfxId: true,
        vendorId: true,
      },
    });

    const bookmarkEventPayload = {
      ...bookmarkData,
      objectType: 'RFX',
    };
    this.rmsRMQClient.emit('record-bookmark', bookmarkEventPayload);
    // this.amqpConnection.publish('rms', 'record-bookmark', bookmarkEventPayload);

    return bookmarkData;
  }

  async getMyBookmarks(query: CollectionQuery, req?: any): Promise<any> {
    return await this.getMyRfx(
      query,
      req.user.organization.id,
      ESolBookmarkStatus.BOOKMARKED,
    );
  }

  async getMyRegisteredRfx(query: CollectionQuery, req?: any): Promise<any> {
    return await this.getMyRfx(
      query,
      req.user.organization.id,
      ESolBookmarkStatus.REGISTERED,
    );
  }

  private async getMyRfx(
    query: CollectionQuery,
    userId: string,
    status: ESolBookmarkStatus,
  ): Promise<any> {
    query.includes.push('rfx');

    query.where.push([
      {
        column: 'vendorId',
        operator: FilterOperators.EqualTo,
        value: userId,
      },
    ]);
    query.where.push([
      {
        column: 'status',
        operator: FilterOperators.EqualTo,
        value: status,
      },
    ]);

    const dataQuery = QueryConstructor.constructQuery<SolBookmark>(
      this.solBookmarkRepository,
      query,
    );
    const response = new DataResponseFormat<SolBookmark>();
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
