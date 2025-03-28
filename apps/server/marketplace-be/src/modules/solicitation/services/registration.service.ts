import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CollectionQuery,
  DataResponseFormat,
  ENTITY_MANAGER_KEY,
  ExtraCrudService,
  QueryConstructor,
} from 'megp-shared-be';
import { RFX, SolBookmark, SolRegistration } from 'src/entities';
import { EntityManager, Repository, SelectQueryBuilder } from 'typeorm';
import { EncryptionHelperService } from '../../../utils/services/encryption-helper.service';
import { REQUEST } from '@nestjs/core';
import { CreateRegistrationDto } from '../dtos/registration.dto';
import {
  ERfxStatus,
  ESolBookmarkStatus,
  ESolRegistrationStatus,
} from 'src/utils/enums';
import * as crypto from 'crypto';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class SolRegistrationService extends ExtraCrudService<SolRegistration> {
  constructor(
    @InjectRepository(SolRegistration)
    private readonly solRegistrationRepository: Repository<SolRegistration>,
    private readonly encryptionHelperService: EncryptionHelperService,
    // private readonly amqpConnection: AmqpConnection,
    @Inject('RMS_RMQ_SERVICE')
    private readonly rmsRMQClient: ClientProxy,
    @Inject(REQUEST) private request: Request,
  ) {
    super(solRegistrationRepository);
  }

  async create(itemData: CreateRegistrationDto, req?: any) {
    const manager: EntityManager = this.request[ENTITY_MANAGER_KEY];
    const registrationReo = manager.getRepository(SolRegistration);

    const rfx = await manager.getRepository(RFX).findOne({
      where: {
        id: itemData.rfxId,
      },
      relations: {
        rfxBidProcedure: true,
      },
    });

    const now = new Date();

    if (!rfx) {
      throw new BadRequestException('RFQ not found');
    } else if (rfx.rfxBidProcedure.submissionDeadline < now) {
      throw new BadRequestException('Submission deadline has passed');
    }

    const vendorId = req.user.organization.id;
    const vendorName = req.user.organization.name;

    const registeredVendor = await this.solRegistrationRepository.exists({
      where: {
        rfxId: itemData.rfxId,
        vendorId,
      },
    });

    if (registeredVendor) {
      throw new BadRequestException('RFQ Already Registered');
    }

    const solBookmark = await manager.getRepository(SolBookmark).exists({
      where: {
        rfxId: itemData.rfxId,
        vendorId,
      },
    });

    if (solBookmark) {
      await manager.getRepository(SolBookmark).update(
        {
          rfxId: itemData.rfxId,
          vendorId,
        },
        {
          status: ESolBookmarkStatus.REGISTERED,
        },
      );
    }

    const saltLength = 16;
    const salt = crypto
      .randomBytes(Math.ceil(saltLength / 2))
      .toString('hex')
      .slice(0, saltLength);

    const dataToEncrypt = vendorId + vendorName;

    const encryptedData = await this.encryptionHelperService.encryptData(
      dataToEncrypt,
      '123456',
      salt,
    );

    const rfxRegistration = registrationReo.create({
      rfxId: itemData.rfxId,
      vendorId,
      vendorName,
      salt,
      response: encryptedData,
    });
    await registrationReo.insert(rfxRegistration);

    const registrationEventPayload = {
      ...rfxRegistration,
      userId: vendorId,
      objectType: 'RFX',
    };

    this.rmsRMQClient.emit('record-registration', registrationEventPayload);

    return rfxRegistration;
  }

  async getMyRegistrations(query: CollectionQuery, user: any) {
    const entityManager: EntityManager = this.request[ENTITY_MANAGER_KEY];

    const dataQuery = QueryConstructor.constructQuery<RFX>(
      entityManager.getRepository(RFX),
      query,
    );

    dataQuery
      .leftJoin('rfxes.solRegistrations', 'solRegistration')
      .where('solRegistration.vendorId = :vendorId', {
        vendorId: user.organization.id,
      });

    return await this.giveQueryResponse<RFX>(query, dataQuery);
  }

  async solicitationStatus(query: CollectionQuery, user: any) {
    const entityManager: EntityManager = this.request[ENTITY_MANAGER_KEY];

    const dataQuery = QueryConstructor.constructQuery<RFX>(
      entityManager.getRepository(RFX),
      query,
    );

    dataQuery
      .where('rfxes.status = :status', { status: ERfxStatus.APPROVED })
      .andWhere('rfxes.organizationId = :organizationId', {
        organizationId: user.organization.id,
      })
      .loadRelationCountAndMap(
        'rfxes.solRegistrationCount',
        'rfxes.solRegistrations',
        'registration',
        (qb) =>
          qb.where('registration.status IN (:...status)', {
            status: [
              ESolRegistrationStatus.REGISTERED,
              ESolRegistrationStatus.SUBMITTED,
            ],
          }),
      );

    return await this.giveQueryResponse<RFX>(query, dataQuery);
  }

  async giveQueryResponse<T>(
    query: CollectionQuery,
    dataQuery: SelectQueryBuilder<T>,
  ) {
    const response = new DataResponseFormat<T>();
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
