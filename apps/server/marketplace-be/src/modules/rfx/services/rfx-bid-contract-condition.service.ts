import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtraCrudService } from 'megp-shared-be';
import { RFX, RfxBidContractCondition, RfxContractTerm } from 'src/entities';
import { Repository } from 'typeorm';
import {
  CreateRfxBidContractConditionDTO,
  UpdateRfxBidContractConditionDTO,
} from '../dtos/rfx-bid-contract.dto';
import { RfxService } from './rfx.service';
import { ERfxStatus } from 'src/utils/enums';

@Injectable()
export class RfxBidContractConditionService extends ExtraCrudService<RfxBidContractCondition> {
  constructor(
    @InjectRepository(RfxBidContractCondition)
    private readonly rfxBidContractConditionRepository: Repository<RfxBidContractCondition>,
    @InjectRepository(RfxContractTerm)
    private readonly rfxContractTermRepository: Repository<RfxContractTerm>,
    @InjectRepository(RFX)
    private readonly rfxRepository: Repository<RFX>,
    private readonly rfxService: RfxService,
  ) {
    super(rfxBidContractConditionRepository);
  }

  async create(itemData: CreateRfxBidContractConditionDTO, req?: any) {
    const rfx = await this.rfxRepository.findOne({
      where: {
        id: itemData.rfxId,
        status: ERfxStatus.DRAFT,
      },
      select: {
        id: true,
        status: true,
      },
    });

    if (!rfx) throw new NotFoundException('Draft RFQ not found');

    const rfxBidContract =
      this.rfxBidContractConditionRepository.create(itemData);

    const rfxContractTerms = itemData.contractTerms.map((term, index) => ({
      term,
      order: index,
      rfxId: itemData.rfxId,
    }));

    const contractTerms =
      this.rfxContractTermRepository.create(rfxContractTerms);
    await Promise.all([
      this.rfxContractTermRepository.upsert(contractTerms, ['rfxId', 'order']),
      this.rfxBidContractConditionRepository.insert(rfxBidContract),
    ]);

    return rfxBidContract;
  }

  async update(
    id: string,
    itemData: UpdateRfxBidContractConditionDTO,
    req?: any,
  ) {
    const rfxContractCondition =
      await this.rfxBidContractConditionRepository.findOne({
        where: {
          id,
        },
        relations: {
          rfx: {
            rfxBidProcedure: true,
          },
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
      });

    if (!rfxContractCondition)
      throw new BadRequestException('rfx bid condition not found');

    await this.rfxService.validateUpdateRequest(rfxContractCondition.rfx);

    const rfxConditionUpdate =
      this.rfxBidContractConditionRepository.create(itemData);
    await this.rfxBidContractConditionRepository.update(id, rfxConditionUpdate);
    return rfxConditionUpdate;
  }
}
