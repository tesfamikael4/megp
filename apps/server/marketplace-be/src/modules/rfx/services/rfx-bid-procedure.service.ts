import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtraCrudService } from 'megp-shared-be';
import { RFX, RfxBidProcedure } from 'src/entities';
import { Repository } from 'typeorm';
import {
  CreateRfxBidProcedureDTO,
  UpdateRfxBidProcedureDTO,
} from '../dtos/rfx-bid-procedure.dto';
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
      },
    });

    if (!rfx) throw new NotFoundException('Draft RFQ not found');

    const rfxBidContract = this.rfxBidProcedureRepository.create(itemData);
    await this.rfxBidProcedureRepository.insert(rfxBidContract);
    return rfxBidContract;
  }

  async update(id: string, itemData: UpdateRfxBidProcedureDTO) {
    const rfx = await this.rfxRepository.findOne({
      where: {
        rfxBidProcedure: {
          id,
        },
      },
      relations: {
        rfxBidProcedure: true,
      },
      select: {
        id: true,
        status: true,
      },
    });

    if (!rfx) throw new BadRequestException('rfx not found');

    await this.rfxService.validateUpdateRequest(rfx);

    const rfxDocUpdate = this.rfxBidProcedureRepository.create(itemData);
    await this.rfxBidProcedureRepository.update(id, itemData);
    return rfxDocUpdate;
  }
}
