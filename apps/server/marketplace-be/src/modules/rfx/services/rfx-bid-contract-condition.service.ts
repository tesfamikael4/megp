import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtraCrudService } from 'megp-shared-be';
import { RFX, RfxBidContractCondition } from 'src/entities';
import { Repository } from 'typeorm';
import {
  CreateRfxBidContractConditionDTO,
  UpdateRfxBidContractConditionDTO,
} from '../dtos/rfx-bid-contract.dto';
import { RfxService } from './rfx.service';

@Injectable()
export class RfxBidContractConditionService extends ExtraCrudService<RfxBidContractCondition> {
  constructor(
    @InjectRepository(RfxBidContractCondition)
    private readonly rfxBidContractConditionRepository: Repository<RfxBidContractCondition>,
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

    const rfxBidContract =
      this.rfxBidContractConditionRepository.create(itemData);

    await this.rfxBidContractConditionRepository.insert(rfxBidContract);

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
          rfx: true,
        },
        select: {
          id: true,
          rfx: {
            id: true,
            status: true,
            reviewDeadline: true,
          },
        },
      });

    if (!rfxContractCondition)
      throw new BadRequestException('rfx bid condition not found');

    await this.rfxService.isUpdatable(rfxContractCondition.rfx);

    const rfxConditionUpdate =
      this.rfxBidContractConditionRepository.create(itemData);
    await this.rfxBidContractConditionRepository.update(id, itemData);
    return rfxConditionUpdate;
  }
}
