import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ENTITY_MANAGER_KEY, ExtraCrudService } from 'megp-shared-be';
import { RFX, RfxBidQualification } from 'src/entities';
import { EntityManager, Repository } from 'typeorm';
import {
  CreateRfxBidQualificationDto,
  UpdateRfxBidQualificationDto,
} from '../dtos/rfx-qualification.dto';
import { RfxService } from './rfx.service';
import { ERfxStatus } from 'src/utils/enums';
import { REQUEST } from '@nestjs/core';

@Injectable()
export class RfxBidQualificationService extends ExtraCrudService<RfxBidQualification> {
  constructor(
    @InjectRepository(RfxBidQualification)
    private readonly rfxBidQualificationRepository: Repository<RfxBidQualification>,
    @InjectRepository(RFX)
    private readonly rfxRepository: Repository<RFX>,
    @Inject(REQUEST) private readonly request: Request,
    private readonly rfxService: RfxService,
  ) {
    super(rfxBidQualificationRepository);
  }

  async create(itemData: CreateRfxBidQualificationDto, req?: any) {
    const rfx = await this.rfxRepository.findOne({
      where: {
        id: itemData.rfxId,
      },
      select: {
        id: true,
        status: true,
        reviewDeadline: true,
      },
    });

    if (!rfx) throw new NotFoundException('no rfx found');

    const isUpdatable = await this.rfxService.isUpdatable(rfx);

    if (!isUpdatable) throw new BadRequestException('rfx not updatable');

    const rfxBidQualification =
      this.rfxBidQualificationRepository.create(itemData);
    await this.rfxBidQualificationRepository.insert(rfxBidQualification);
    return rfxBidQualification;
  }

  async update(id: string, itemData: UpdateRfxBidQualificationDto) {
    const entityManager: EntityManager = this.request[ENTITY_MANAGER_KEY];

    const rfxBidQuali = await this.rfxBidQualificationRepository.findOne({
      where: {
        id,
      },
      select: {
        id: true,
        rfx: {
          id: true,
          status: true,
          reviewDeadline: true,
        },
      },
      relations: {
        rfx: true,
      },
    });

    if (!rfxBidQuali)
      throw new NotFoundException('no rfx bid qualification found');

    await this.rfxService.isUpdatable(rfxBidQuali.rfx);

    const rfxDocUpdate = this.rfxBidQualificationRepository.create(itemData);
    await this.rfxBidQualificationRepository.update(id, itemData);
    return rfxDocUpdate;
  }
}
