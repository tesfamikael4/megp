import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CollectionQuery,
  DataResponseFormat,
  ExtraCrudService,
  QueryConstructor,
} from 'megp-shared-be';
import { Repository, SelectQueryBuilder } from 'typeorm';
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

  async getEvidencesWithVendors(
    rfxId: string,
    user: any,
    query: CollectionQuery,
  ) {
    const dataQuery = QueryConstructor.constructQuery<RfxDocumentaryEvidence>(
      this.rfxDocumentaryEvidenceRepository,
      query,
    )
      .where('rfx_documentary_evidences.rfxId = :rfxId', { rfxId })
      .leftJoinAndSelect(
        'rfx_documentary_evidences.openedResponses',
        'openedResponse',
      )
      .leftJoinAndSelect('openedResponse.solRegistration', 'solReg')
      .leftJoinAndSelect(
        'solReg.evaluationAssessments',
        'assessment',
        'assessment.isTeamAssessment = true',
      )
      .select([
        'rfx_documentary_evidences.id',
        'rfx_documentary_evidences.documentTitle',
        'rfx_documentary_evidences.description',
        'rfx_documentary_evidences.order',
        'openedResponse.id',
        'openedResponse.value',
        'solReg.id',
        'solReg.vendorId',
        'solReg.vendorName',
        'assessment.id',
        'assessment.qualified',
      ]);

    return await this.giveQueryResponse(query, dataQuery);
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

  async softDelete(id: string, req?: any): Promise<void> {
    await this.rfxDocumentaryEvidenceRepository.delete({ id });
  }

  private async giveQueryResponse<T>(
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
