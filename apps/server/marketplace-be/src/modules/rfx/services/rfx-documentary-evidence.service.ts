import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtraCrudService } from 'megp-shared-be';
import { In, Repository } from 'typeorm';
import { RfxDocumentaryEvidence } from 'src/entities/rfx-documentary-evidence.entity';
import {
  CreateRfxDocumetaryEvidenceDto,
  UpdateRfxDocumetaryEvidenceDto,
} from '../dtos/rfx-documentary-evidence.dto';
import { RFX } from 'src/entities';
import { ERfxStatus } from 'src/utils/enums/rfx.enums';
import { RfxService } from './rfx.service';

@Injectable()
export class RfxDocumentaryEvidenceService extends ExtraCrudService<RfxDocumentaryEvidence> {
  constructor(
    @InjectRepository(RfxDocumentaryEvidence)
    private readonly rfxDocumentaryEvidenceRepository: Repository<RfxDocumentaryEvidence>,
    @InjectRepository(RFX)
    private readonly rfxRepository: Repository<RFX>,
    private readonly rfxService: RfxService,
  ) {
    super(rfxDocumentaryEvidenceRepository);
  }

  async create(itemData: CreateRfxDocumetaryEvidenceDto, req?: any) {
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
      this.rfxDocumentaryEvidenceRepository.create(itemData);
    await this.rfxDocumentaryEvidenceRepository.insert(rfxBidQualification);
    return rfxBidQualification;
  }

  async update(id: string, itemData: UpdateRfxDocumetaryEvidenceDto) {
    const rfxDocEvidence = await this.rfxDocumentaryEvidenceRepository.findOne({
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

    const isUpdatable = await this.rfxService.isUpdatable(rfxDocEvidence.rfx);
    if (!isUpdatable) throw new BadRequestException('rfx_not_updatable');

    const rfxDocUpdate = this.rfxDocumentaryEvidenceRepository.create(itemData);
    await this.rfxDocumentaryEvidenceRepository.update(id, itemData);
    return rfxDocUpdate;
  }
}
