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
import { RFX, RfxContractTerm } from 'src/entities';
import { RfxService } from './rfx.service';
import {
  CreateRfxContractTermDto,
  UpdateRfxContractTermDto,
} from '../dtos/rfx-contract-term.dto';

@Injectable()
export class RfxContractTermService extends ExtraCrudService<RfxContractTerm> {
  constructor(
    @InjectRepository(RfxContractTerm)
    private readonly rfxContractTermRepository: Repository<RfxContractTerm>,
    @InjectRepository(RFX)
    private readonly rfxRepository: Repository<RFX>,
    private readonly rfxService: RfxService,
  ) {
    super(rfxContractTermRepository);
  }

  async create(itemData: CreateRfxContractTermDto, req?: any) {
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

    if (!rfx) throw new NotFoundException('RFQ Not found');

    await this.rfxService.validateUpdateRequest(rfx);

    const rfxBidQualification = this.rfxContractTermRepository.create(itemData);
    await this.rfxContractTermRepository.insert(rfxBidQualification);
    return rfxBidQualification;
  }

  async update(id: string, itemData: UpdateRfxContractTermDto) {
    const rfxDocEvidence = await this.rfxContractTermRepository.findOne({
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

    const rfxDocUpdate = this.rfxContractTermRepository.create(itemData);
    await this.rfxContractTermRepository.update(id, itemData);
    return rfxDocUpdate;
  }
}
