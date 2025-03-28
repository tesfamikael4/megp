import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { BidResponseLot } from 'src/entities/bid-response-lot.entity';
import { ENTITY_MANAGER_KEY } from 'src/shared/interceptors';
import { EntityManager, Repository } from 'typeorm';
import {
  CheckPasswordDto,
  CreateBidResponseDto,
  GetBidResponseDto,
  GenerateBidDeclarationDto,
} from '../dto/bid-response.dto';
import { EncryptionHelperService } from './encryption-helper.service';
import { BidRegistration } from 'src/entities/bid-registration.entity';
import { Item } from 'src/entities';
import {
  CollectionQuery,
  FilterOperators,
  QueryConstructor,
} from 'src/shared/collection-query';
import { DataResponseFormat } from 'src/shared/api-data';
import { BucketNameEnum, MinIOService } from 'src/shared/min-io';
import { DocumentManipulatorService } from 'src/shared/document-manipulator/document-manipulator.service';
import { DocxService } from 'src/shared/docx/docx.service';
import { SpdBidForm } from 'src/entities/spd-bid-form.entity';
import { BidRegistrationDetail, BidResponseDocument } from 'src/entities';

@Injectable()
export class BidResponseLotService {
  constructor(
    @InjectRepository(BidResponseLot)
    private readonly bidSecurityRepository: Repository<BidResponseLot>,
    private readonly encryptionHelperService: EncryptionHelperService,
    private readonly minIOService: MinIOService,
    private readonly documentManipulatorService: DocumentManipulatorService,
    private readonly docxService: DocxService,
    @Inject(REQUEST) private request: Request,
  ) {}

  async create(itemData: CreateBidResponseDto, req?: any): Promise<any> {
    const manager: EntityManager = this.request[ENTITY_MANAGER_KEY];
    const bidderId = req.user.organization.id;

    const bidRegistrationDetail = await manager
      .getRepository(BidRegistrationDetail)
      .findOne({
        where: {
          lotId: itemData.lotId,
          bidRegistration: {
            bidderId: bidderId,
          },
        },
        relations: {
          bidRegistration: true,
        },
      });
    if (!bidRegistrationDetail) {
      throw new BadRequestException('bid_registration_not_found');
    }

    const isPasswordValid = this.encryptionHelperService.checkPasswordValidity(
      bidRegistrationDetail.bidRegistration,
      itemData.documentType,
      itemData.password,
    );
    if (!isPasswordValid) {
      throw new BadRequestException('invalid_password');
    }

    const encryptedValue = this.encryptionHelperService.encryptData(
      JSON.stringify(itemData.value),
      itemData.password,
      bidRegistrationDetail.bidRegistration.salt,
    );

    const item = this.bidSecurityRepository.create(itemData);
    item.bidRegistrationDetailId = bidRegistrationDetail.id;
    item.value = encryptedValue;
    await this.bidSecurityRepository.upsert(item, [
      'bidRegistrationDetailId',
      'key',
    ]);
    return item;
  }

  async getBidResponseByKey(itemData: GetBidResponseDto, req?: any) {
    const bidderId = req.user.organization.id;

    const bidResponse = await this.bidSecurityRepository.findOne({
      where: {
        documentType: itemData.documentType,
        key: itemData.key,
        bidRegistrationDetail: {
          lotId: itemData.lotId,
          bidRegistration: {
            bidderId: bidderId,
          },
        },
      },
      relations: {
        bidRegistrationDetail: {
          bidRegistration: true,
        },
      },
    });
    if (!bidResponse) {
      throw new BadRequestException('bid_response_not_found');
    }

    const decryptedValue = this.encryptionHelperService.decryptedData(
      bidResponse.value,
      itemData.password,
      bidResponse.bidRegistrationDetail.bidRegistration.salt,
    );
    return decryptedValue;
  }

  async getItems(lotId: string, query: CollectionQuery, req?: any) {
    const manager: EntityManager = this.request[ENTITY_MANAGER_KEY];
    const bidderId = req.user.organization.id;

    const bidRegistrationDetail = await manager
      .getRepository(BidRegistrationDetail)
      .findOne({
        where: {
          lotId: lotId,
          bidRegistration: {
            bidderId: bidderId,
          },
        },
      });
    if (!bidRegistrationDetail) {
      throw new BadRequestException('bid_registration_not_found');
    }

    const itemId = [
      ...(bidRegistrationDetail?.financialItems ?? []),
      ...(bidRegistrationDetail?.technicalItems ?? []),
    ];

    if (itemId.length < 1) {
      return {
        total: 0,
        items: [],
      };
    }

    const itemRepository = manager.getRepository(Item);

    query.where.push([
      {
        column: 'id',
        value: itemId,
        operator: FilterOperators.In,
      },
    ]);

    const response = new DataResponseFormat<Item>();
    const dataQuery = QueryConstructor.constructQuery<Item>(
      itemRepository,
      query,
    );

    if (query.count) {
      response.total = await dataQuery.getCount();
    } else {
      const [result, total] = await dataQuery.getManyAndCount();
      response.total = total;
      response.items = result;
    }
    return response;
  }

  async checkPassword(itemData: CheckPasswordDto, req?: any) {
    try {
      const manager: EntityManager = this.request[ENTITY_MANAGER_KEY];
      const bidderId = req.user.organization.id;

      const bidRegistration = await manager
        .getRepository(BidRegistration)
        .findOne({
          where: {
            tenderId: itemData.tenderId,
            bidderId: bidderId,
          },
        });
      if (!bidRegistration) {
        throw new BadRequestException('bid_registration_not_found');
      }

      const decryptedValue = this.encryptionHelperService.checkPasswordValidity(
        bidRegistration,
        itemData.documentType,
        itemData.password,
      );

      return decryptedValue;
    } catch (error) {
      if (error?.message == 'invalid_password') {
        return false;
      }
      throw error;
    }
  }

  async generateBidDeclaration(payload: GenerateBidDeclarationDto, req?: any) {
    const manager: EntityManager = this.request[ENTITY_MANAGER_KEY];
    const bidderId = req.user.organization.id;

    const bidRegistrationDetail = await manager
      .getRepository(BidRegistrationDetail)
      .findOne({
        where: {
          lotId: payload.lotId,
          bidRegistration: {
            bidderId: bidderId,
          },
        },
        relations: {
          bidRegistration: {
            tender: true,
          },
        },
      });
    if (!bidRegistrationDetail) {
      throw new BadRequestException('bid_registration_not_found');
    }

    const isPasswordValid = this.encryptionHelperService.checkPasswordValidity(
      bidRegistrationDetail.bidRegistration,
      payload.documentType,
      payload.password,
    );
    if (!isPasswordValid) {
      throw new BadRequestException('invalid_password');
    }

    const bidResponseLot = await manager
      .getRepository(BidResponseLot)
      .findOneBy({
        bidRegistrationDetailId: bidRegistrationDetail.id,
        documentType: payload.documentType,
        key: 'experts',
      });

    if (!bidResponseLot) {
      throw new BadRequestException('experts_not_found');
    }

    const decryptedExperts = this.encryptionHelperService.decryptedData(
      bidResponseLot.value,
      payload.password,
      bidRegistrationDetail.bidRegistration.salt,
    );

    const experts = JSON.parse(decryptedExperts).value;

    const spdBidForms = await manager.getRepository(SpdBidForm).findBy({
      spd: {
        tenderSpds: {
          tenderId: bidRegistrationDetail.bidRegistration.tenderId,
        },
      },
    });

    for (const spdBidForm of spdBidForms) {
      const fileReadable = await this.minIOService.downloadBuffer(
        spdBidForm.documentDocx,
      );

      const fileBuffer =
        await this.documentManipulatorService.streamToBuffer(fileReadable);

      const docx = await this.docxService.generateDocx(fileBuffer, {
        public_body:
          bidRegistrationDetail.bidRegistration.tender.organizationName,
        subject_of_procurement:
          bidRegistrationDetail.bidRegistration.tender.name,
        project_name: bidRegistrationDetail.bidRegistration.tender.name,
        date_of_issue_of_bidding: new Date().toDateString(),
        procurement_reference_no:
          bidRegistrationDetail.bidRegistration.tender
            .procurementReferenceNumber,
        procurement_Reference_number:
          bidRegistrationDetail.bidRegistration.tender
            .procurementReferenceNumber,
        place_and_date: new Date().toDateString(),
        date: new Date().toDateString(),
        experts: experts,
        company_name: bidRegistrationDetail.bidRegistration.bidderName,
      });

      const pdfBuffer =
        await this.documentManipulatorService.convertDocxToPdf(docx);

      const documentDocx = await this.minIOService.uploadBuffer(
        docx,
        spdBidForm.title + '-bid-form.docx',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        BucketNameEnum.BID_FORM_DOCUMENT,
      );

      const documentPdf = await this.minIOService.uploadBuffer(
        pdfBuffer,
        spdBidForm.title + '-bid-form.pdf',
        'application/pdf',
        BucketNameEnum.BID_FORM_DOCUMENT,
      );

      const encryptedValueDocx = this.encryptionHelperService.encryptData(
        JSON.stringify({
          value: documentDocx,
        }),
        payload.password,
        bidRegistrationDetail.bidRegistration.salt,
      );

      const encryptedValuePdf = this.encryptionHelperService.encryptData(
        JSON.stringify({
          value: documentPdf,
        }),
        payload.password,
        bidRegistrationDetail.bidRegistration.salt,
      );

      const item = manager.getRepository(BidResponseDocument).create({
        bidRegistrationDetailId: bidRegistrationDetail.id,
        bidFormId: spdBidForm.id,
        documentType: payload.documentType,
        value: encryptedValueDocx,
        pdfValue: encryptedValuePdf,
      });

      await manager
        .getRepository(BidResponseDocument)
        .upsert(item, ['bidRegistrationDetailId', 'bidFormId']);
    }

    return spdBidForms;
  }
}
