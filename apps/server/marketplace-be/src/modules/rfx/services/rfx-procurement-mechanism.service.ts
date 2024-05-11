import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtraCrudService } from 'megp-shared-be';
import { RfxProcurementMechanism } from 'src/entities';
import { Repository } from 'typeorm';

@Injectable()
export class RfxProcurementMechanismService extends ExtraCrudService<RfxProcurementMechanism> {
  constructor(
    @InjectRepository(RfxProcurementMechanism)
    private readonly rfxProcurementMechanismRepository: Repository<RfxProcurementMechanism>,
  ) {
    super(rfxProcurementMechanismRepository);
  }

  async findOne(
    rfxId: string,
    req?: any,
  ): Promise<RfxProcurementMechanism | undefined> {
    return await this.rfxProcurementMechanismRepository.findOneBy({ rfxId });
  }

  async update(id: string, itemData: any) {
    const item = await this.rfxProcurementMechanismRepository.findOneBy({
      rfxId: id,
    });
    await this.rfxProcurementMechanismRepository.update(item.id, itemData);
    return {
      ...item,
      ...itemData,
    };
  }
}
