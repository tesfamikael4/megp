import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExtraCrudService } from 'src/shared/service';
import { BidGuarantee } from 'src/entities/bid-guarantee.entity';
import { UpdateGuaranteeStatusDto } from '../dto/update-bid-guarantee-status.dto';
import { Lot } from 'src/entities';
import { CreateBidGuaranteeDto } from '../dto/bid-guarantee.dto';
@Injectable()
export class BidGuaranteeService extends ExtraCrudService<BidGuarantee> {
  constructor(
    @InjectRepository(BidGuarantee)
    private readonly bidGuaranteeRepository: Repository<BidGuarantee>,
    @InjectRepository(Lot)
    private readonly lotRepository: Repository<Lot>,
  ) {
    super(bidGuaranteeRepository);
  }

  async create(itemData: CreateBidGuaranteeDto, req?: any): Promise<any> {
    if (req?.user?.organization) {
      itemData.bidderId = req.user.organization.id;
      itemData.bidderName = req.user.organization.name;
    }

    const lot = await this.lotRepository.findOne({
      where: {
        id: itemData.lotId,
      },
      relations: {
        tender: true,
      },
      select: {
        tender: {
          organizationId: true,
          organizationName: true,
        },
      },
    });
    if (!lot) {
      // Handle the case where lot is not found
      throw new NotFoundException('Lot not found');
    }
    itemData.organizationId = lot.tender.organizationId;
    itemData.organizationName = lot.tender.organizationName;
    const item = this.bidGuaranteeRepository.create(itemData);
    await this.bidGuaranteeRepository.insert(item);
    return item;
  }

  async updateStatus(
    id: string,
    updateGuaranteeStatusDto: UpdateGuaranteeStatusDto,
  ): Promise<BidGuarantee> {
    const guarantee = await this.findOne(id);
    if (!guarantee) {
      throw new NotFoundException('Guarantee not found');
    }
    return await super.update(id, updateGuaranteeStatusDto);
  }
}
