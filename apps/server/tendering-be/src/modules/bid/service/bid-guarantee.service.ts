import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { ExtraCrudService } from 'src/shared/service';
import { BidGuarantee } from 'src/entities/bid-guarantee.entity';
import { Lot } from 'src/entities';
import {
  CreateBidGuaranteeDto,
  UpdateGuaranteeStatusDto,
} from '../dto/bid-guarantee.dto';
import { BidGuaranteeStatusEnum } from 'src/shared/enums/bid-guarantee-status.enum';
import { REQUEST } from '@nestjs/core';
import { ENTITY_MANAGER_KEY } from 'src/shared/interceptors';
import { SpdBidForm } from 'src/entities/spd-bid-form.entity';
import { DocxService } from 'src/shared/docx/docx.service';
import { BucketNameEnum, MinIOService } from 'src/shared/min-io';
@Injectable()
export class BidGuaranteeService extends ExtraCrudService<BidGuarantee> {
  constructor(
    @InjectRepository(BidGuarantee)
    private readonly bidGuaranteeRepository: Repository<BidGuarantee>,
    private readonly docxService: DocxService,
    private readonly minIOService: MinIOService,
    @Inject(REQUEST) private request: Request,
  ) {
    super(bidGuaranteeRepository);
  }

  async create(itemData: CreateBidGuaranteeDto, req?: any): Promise<any> {
    if (req?.user?.organization) {
      itemData.bidderId = req.user.organization.id;
      itemData.bidderName = req.user.organization.name;
    }
    const manager: EntityManager = this.request[ENTITY_MANAGER_KEY];

    const lot = await manager.getRepository(Lot).findOne({
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

    if (updateGuaranteeStatusDto.status == BidGuaranteeStatusEnum.REQUESTED) {
      const manager: EntityManager = this.request[ENTITY_MANAGER_KEY];

      const spdTemplate = await manager.getRepository(SpdBidForm).findOneBy({
        type: 'bid-security',
        spd: {
          tenderSpds: {
            tender: {
              lots: {
                id: guarantee.lotId,
              },
            },
          },
        },
      });
      if (!spdTemplate) {
        throw new BadRequestException('template_not_found');
      }

      const docx = await this.docxService.generateDocx(
        spdTemplate.documentDocx,
        {
          supplierName: guarantee.bidderName,
          amount: guarantee.amount,
        },
      );

      updateGuaranteeStatusDto.document = await this.minIOService.uploadBuffer(
        docx,
        'bid_security.pdf',
        'application/pdf',
        BucketNameEnum.BID_SECURITY_DOCUMENT,
      );
    }

    return await super.update(id, updateGuaranteeStatusDto);
  }

  async downloadDocument(id: string) {
    const guarantee = await this.findOne(id);
    if (!guarantee) {
      throw new NotFoundException('Guarantee not found');
    } else if (!guarantee.document) {
      throw new NotFoundException('Document not found');
    }

    const presignedUrl = await this.minIOService.generatePresignedDownloadUrl(
      guarantee.document,
    );
    return { presignedUrl };
  }
}
