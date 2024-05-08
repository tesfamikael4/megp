import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, In, Repository } from 'typeorm';
import { ExtraCrudService } from 'src/shared/service';
import { BidGuarantee } from 'src/entities/bid-guarantee.entity';
import { Lot } from 'src/entities';
import {
  CreateBidGuaranteeDto,
  UpdateGuaranteeStatusDto,
} from '../dto/bid-guarantee.dto';
import { BidGuaranteeStatusEnum } from 'src/shared/enums';
import { REQUEST } from '@nestjs/core';
import { ENTITY_MANAGER_KEY } from 'src/shared/interceptors';
import { SpdBidForm } from 'src/entities/spd-bid-form.entity';
import { DocxService } from 'src/shared/docx/docx.service';
import { BucketNameEnum, MinIOService } from 'src/shared/min-io';
import {
  CollectionQuery,
  FilterOperators,
  QueryConstructor,
} from 'src/shared/collection-query';
import { DataResponseFormat } from 'src/shared/api-data';
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
      throw new NotFoundException('Lot not found');
    }

    // Check if there are previous bid guarantees for the lot and bidder
    const previousGuarantees = await this.bidGuaranteeRepository.exists({
      where: {
        lotId: itemData.lotId,
        bidderId: itemData.bidderId,
        status: In([
          BidGuaranteeStatusEnum.REQUESTED,
          BidGuaranteeStatusEnum.REVIEWED,
          BidGuaranteeStatusEnum.VERIFIED,
          BidGuaranteeStatusEnum.APPROVED,
          BidGuaranteeStatusEnum.EXPIRED,
        ]),
      },
    });

    if (previousGuarantees) {
      throw new BadRequestException(
        'A bid guarantee has already been requested and is under review.',
      );
    }
    itemData.organizationId = lot.tender.organizationId;
    itemData.organizationName = lot.tender.organizationName;
    const item = this.bidGuaranteeRepository.create(itemData);
    await this.bidGuaranteeRepository.insert(item);
    return item;
  }

  async getBidGuaranteesByGuarantorId(
    query: CollectionQuery,
    req?: any,
  ): Promise<any> {
    try {
      query.where.push([
        {
          column: 'guarantorId',
          operator: FilterOperators.EqualTo,
          value: req.user.organization.id,
        },
      ]);

      const dataQuery = QueryConstructor.constructQuery<BidGuarantee>(
        this.bidGuaranteeRepository,
        query,
      );
      const response = new DataResponseFormat<BidGuarantee>();
      if (query.count) {
        response.total = await dataQuery.getCount();
      } else {
        const [result, total] = await dataQuery.getManyAndCount();
        response.total = total;
        response.items = result;
      }
      return response;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async canCreate(lotId: string): Promise<boolean> {
    return await this.bidGuaranteeRepository.exists({
      where: {
        lotId,
        status: In([
          BidGuaranteeStatusEnum.REQUESTED,
          BidGuaranteeStatusEnum.REVIEWED,
          BidGuaranteeStatusEnum.VERIFIED,
          BidGuaranteeStatusEnum.APPROVED,
          BidGuaranteeStatusEnum.EXPIRED,
        ]),
      },
    });
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
