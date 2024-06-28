import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SpdTemplate, Tender } from 'src/entities';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { GenerateTenderDocumentDto } from '../dto';
import { TenderStatusEnum } from 'src/shared/enums/tender-status.enum';
import { BucketNameEnum, MinIOService } from 'src/shared/min-io';
import { DocumentManipulatorService } from 'src/shared/document-manipulator/document-manipulator.service';
import { REQUEST } from '@nestjs/core';
import { ENTITY_MANAGER_KEY } from 'src/shared/interceptors';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class TenderApprovalService {
  constructor(
    @InjectRepository(Tender)
    private readonly tenderRepository: Repository<Tender>,
    private readonly minIOService: MinIOService,
    private readonly documentManipulatorService: DocumentManipulatorService,
    @Inject(REQUEST) private request: Request,
    private connection: DataSource,
  ) {}

  async tenderApproval(data: {
    status: string;
    activityId: string;
    itemId: string;
  }) {
    console.log('🚀 ~ TenderApprovalService ~ tender approval started');

    if (!data.itemId) {
      throw new RpcException('incomplete_data');
    }
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const tender = await this.tenderRepository.findOneBy({
        id: data.itemId,
      });

      if (!tender) {
        throw new RpcException('Tender not found');
      }
      let tenderInvitation = null;

      const manager: EntityManager = queryRunner.manager;

      if (data.status == 'Approved') {
        tenderInvitation = await this.generateTenderInvitation(
          { id: tender.id },
          manager,
        );
      }

      await manager.getRepository(Tender).update(
        { id: data.itemId },
        {
          tenderInvitation,
          status:
            data.status == 'Approved'
              ? TenderStatusEnum.APPROVED
              : TenderStatusEnum.ADJUSTED,
        },
      );
      await queryRunner.commitTransaction();
      return data;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.log('🚀 ~ TenderApprovalService ~ tender approval error', {
        error,
      });
      throw error;
    } finally {
      await queryRunner.release();
      console.log('🚀 ~ TenderApprovalService ~ tender approval completed');
    }
  }

  async generateTenderInvitation(
    input: GenerateTenderDocumentDto,
    manager: EntityManager,
  ) {
    const tender = await this.tenderRepository.findOne({
      where: {
        id: input.id,
      },
      relations: {
        spd: true,
      },
    });

    const spdTemplate = await manager.getRepository(SpdTemplate).findOneBy({
      spdId: tender.spd.spdId,
      type: 'invitation',
    });
    if (!spdTemplate) {
      throw new BadRequestException('spd_document_not_found');
    }

    const fileReadable = await this.minIOService.downloadBuffer(
      spdTemplate.documentDocx,
    );

    const fileBuffer =
      await this.documentManipulatorService.streamToBuffer(fileReadable);

    const invitationDocumentBuffer =
      await this.documentManipulatorService.populateTemplate(fileBuffer, {
        public_body: tender.organizationName,
        procurement_reference_no: tender.procurementReferenceNumber,
        subject_of_procurement: tender.name,
      });

    const pdfBuffer = await this.documentManipulatorService.convertDocxToPdf(
      invitationDocumentBuffer,
    );

    const tenderInvitation = await this.minIOService.uploadBuffer(
      pdfBuffer,
      tender.name + '-invitation-document.pdf',
      'application/pdf',
      BucketNameEnum.TENDERING_DOCUMENT,
    );

    return tenderInvitation;
  }
}
