import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SpdTemplate, Tender } from 'src/entities';
import { EntityManager, Repository } from 'typeorm';
import { GenerateTenderDocumentDto } from '../dto';
import { TenderStatusEnum } from 'src/shared/enums/tender-status.enum';
import { BucketNameEnum, MinIOService } from 'src/shared/min-io';
import { DocumentManipulatorService } from 'src/shared/document-manipulator/document-manipulator.service';
// import {
//   MessageHandlerErrorBehavior,
//   RabbitRPC,
// } from '@golevelup/nestjs-rabbitmq';
import { AllowAnonymous } from 'src/shared/authorization';
import { ConsumeMessage } from 'amqplib';

@Injectable()
export class TenderApprovalService {
  constructor(
    @InjectRepository(Tender)
    private readonly tenderRepository: Repository<Tender>,
    private readonly minIOService: MinIOService,
    private readonly documentManipulatorService: DocumentManipulatorService,
  ) {}

  // @RabbitRPC({
  //   exchange: 'workflow-broadcast-exchanges',
  //   routingKey: 'tendering-workflow.tenderApproval',
  //   queue: 'tendering-approval-workflow',
  //   errorBehavior: MessageHandlerErrorBehavior.ACK,
  //   errorHandler: (err) => {
  //     console.log('🚀 ~ TenderController ~ err:', err);
  //   },
  // })
  @AllowAnonymous()
  async tenderApproval(data: any, amqpMsg: ConsumeMessage) {
    if (amqpMsg.fields.routingKey != 'tendering-workflow.tenderApproval') {
      throw new BadRequestException('invalid_message');
    } else if (!data.itemId) {
      throw new BadRequestException('incomplete_data');
    }

    const tender = await this.tenderRepository.findOneBy({
      id: data.itemId,
    });

    if (!tender) {
      throw new BadRequestException('Tender not found');
    }
    let tenderInvitation = null;
    if (data.status == 'Approved') {
      tenderInvitation = await this.generateTenderInvitation(
        { id: tender.id },
        data.ENTITY_MANAGER,
      );
    }
    await this.tenderRepository.update(
      { id: data.itemId },
      {
        tenderInvitation,
        status:
          data.status == 'Approved'
            ? TenderStatusEnum.APPROVED
            : TenderStatusEnum.ADJUSTED,
      },
    );

    return data;
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
