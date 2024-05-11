import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtraCrudService } from 'megp-shared-be';
import { RFX, RfxBidContractCondition } from 'src/entities';
import { In, Repository } from 'typeorm';
import {
  CreateRfxBidContractConditionDTO,
  UpdateRfxBidContractConditionDTO,
} from '../dtos/rfx-bid-contract.dto';
import { ERfxStatus } from 'src/utils/enums/rfx.enums';
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

    if (!rfx) throw new NotFoundException('no_rfx_found');

    const isUpdatable = await this.rfxService.isUpdatable(rfx);

    if (!isUpdatable) throw new BadRequestException('rfx_not_updatable');

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
    const rfxBidProcedure =
      await this.rfxBidContractConditionRepository.findOne({
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
      });

    const isUpdatable = await this.rfxService.isUpdatable(rfxBidProcedure.rfx);

    if (!isUpdatable) throw new BadRequestException('rfx_not_updatable');

    const rfxConditionUpdate =
      this.rfxBidContractConditionRepository.create(itemData);
    await this.rfxBidContractConditionRepository.update(id, itemData);
    return rfxConditionUpdate;
  }
}
