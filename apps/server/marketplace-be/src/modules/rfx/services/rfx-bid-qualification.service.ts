import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtraCrudService } from 'megp-shared-be';
import { RFX, RfxBidQualification } from 'src/entities';
import { In, Repository } from 'typeorm';
import {
  CreateRfxBidQualificationDto,
  UpdateRfxBidQualificationDto,
} from '../dtos/rfx-qualification.dto';
import { ERfxStatus } from 'src/utils/enums/rfx.enums';
import { RfxService } from './rfx.service';

@Injectable()
export class RfxBidQualificationService extends ExtraCrudService<RfxBidQualification> {
  constructor(
    @InjectRepository(RfxBidQualification)
    private readonly rfxBidQualificationRepository: Repository<RfxBidQualification>,
    @InjectRepository(RFX)
    private readonly rfxRepository: Repository<RFX>,
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

    if (!rfx) throw new NotFoundException('no_rfx_found');

    const isUpdatable = await this.rfxService.isUpdatable(rfx);

    if (!isUpdatable) throw new BadRequestException('rfx_not_updatable');

    const rfxBidQualification =
      this.rfxBidQualificationRepository.create(itemData);
    await this.rfxBidQualificationRepository.insert(rfxBidQualification);
    return rfxBidQualification;
  }

  async update(id: string, itemData: UpdateRfxBidQualificationDto) {
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
      throw new NotFoundException('no_rfx_bid_qualification_found');

    const isUpdatable = await this.rfxService.isUpdatable(rfxBidQuali.rfx);
    if (!isUpdatable) throw new BadRequestException('rfx_not_updatable');

    const rfxDocUpdate = this.rfxBidQualificationRepository.create(itemData);
    await this.rfxBidQualificationRepository.update(id, itemData);
    return rfxDocUpdate;
  }
}
