import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtraCrudService } from 'megp-shared-be';
import { Repository } from 'typeorm';
import { RfxDocumentaryEvidence } from 'src/entities/rfx-documentary-evidence.entity';
import {
  CreateRfxDocumetaryEvidenceDto,
  UpdateRfxDocumetaryEvidenceDto,
} from '../dtos/rfx-documentary-evidence.dto';
import { RFX } from 'src/entities';
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
        rfxBidProcedure: {
          reviewDeadline: true,
        },
      },
      relations: {
        rfxBidProcedure: true,
      },
    });

    if (!rfx) throw new NotFoundException('no rfx found');

    await this.rfxService.validateUpdateRequest(rfx);

    const rfxBidQualification =
      this.rfxDocumentaryEvidenceRepository.create(itemData);
    await this.rfxDocumentaryEvidenceRepository.upsert(rfxBidQualification, {
      conflictPaths: {
        rfxId: true,
        order: true,
      },
    });
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
          rfxBidProcedure: {
            id: true,
            reviewDeadline: true,
          },
        },
      },
      relations: {
        rfx: {
          rfxBidProcedure: true,
        },
      },
    });

    await this.rfxService.validateUpdateRequest(rfxDocEvidence.rfx);

    const rfxDocUpdate = this.rfxDocumentaryEvidenceRepository.create(itemData);
    await this.rfxDocumentaryEvidenceRepository.update(id, itemData);
    return rfxDocUpdate;
  }
}
