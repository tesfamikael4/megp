import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtraCrudService } from 'megp-shared-be';
import { RFX, RfxBidProcedure } from 'src/entities';
import { In, Repository } from 'typeorm';
import {
  CreateRfxBidProcedureDTO,
  UpdateRfxBidProcedureDTO,
} from '../dtos/rfx-bid-procedure.dto';
import { ERfxStatus } from 'src/utils/enums/rfx.enums';
import { RfxService } from './rfx.service';

@Injectable()
export class RfxBidProcedureService extends ExtraCrudService<RfxBidProcedure> {
  constructor(
    @InjectRepository(RfxBidProcedure)
    private readonly rfxBidProcedureRepository: Repository<RfxBidProcedure>,
    @InjectRepository(RFX)
    private readonly rfxRepository: Repository<RFX>,
    private readonly rfxService: RfxService,
  ) {
    super(rfxBidProcedureRepository);
  }

  async create(itemData: CreateRfxBidProcedureDTO, req?: any) {
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

    const rfxBidContract = this.rfxBidProcedureRepository.create(itemData);
    await this.rfxBidProcedureRepository.insert(rfxBidContract);
    return rfxBidContract;
  }
  async update(id: string, itemData: UpdateRfxBidProcedureDTO) {
    const rfxBidProcedure = await this.rfxBidProcedureRepository.findOne({
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

    if (!rfxBidProcedure) throw new BadRequestException('rfx_not_found');

    const isUpdatable = await this.rfxService.isUpdatable(rfxBidProcedure.rfx);

    if (!isUpdatable) throw new BadRequestException('rfx_not_updatable');

    const rfxDocUpdate = this.rfxBidProcedureRepository.create(itemData);
    await this.rfxBidProcedureRepository.update(id, itemData);
    return rfxDocUpdate;
  }
}
