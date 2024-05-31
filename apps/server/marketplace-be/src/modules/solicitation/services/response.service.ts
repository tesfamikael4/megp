import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ENTITY_MANAGER_KEY,
  ExtraCrudService,
  MinIOService,
} from 'megp-shared-be';
import { OpenedResponse, SolRegistration, SolResponse } from 'src/entities';
import { EntityManager, In, Repository } from 'typeorm';
import { CreateSolResponseDto } from '../dtos/response.dto';
import { REQUEST } from '@nestjs/core';
import { EncryptionHelperService } from '../../../utils/services/encryption-helper.service';
import { SolRoundService } from './round.service';
import { RfxDocumentaryEvidence } from 'src/entities/rfx-documentary-evidence.entity';

@Injectable()
export class SolResponseService extends ExtraCrudService<SolResponse> {
  constructor(
    @InjectRepository(SolResponse)
    private readonly solResponseRepository: Repository<SolResponse>,
    @InjectRepository(OpenedResponse)
    private readonly openedResponseRepository: Repository<OpenedResponse>,
    @InjectRepository(SolRegistration)
    private readonly solRegistrationRepository: Repository<SolRegistration>,
    @Inject(REQUEST) private readonly request: Request,
    private readonly encryptionHelperService: EncryptionHelperService,
    private readonly minIoService: MinIOService,
    private readonly roundService: SolRoundService,
  ) {
    super(solResponseRepository);
  }

  async create(itemData: CreateSolResponseDto, req?: any) {
    const manager: EntityManager = this.request[ENTITY_MANAGER_KEY];

    await this.roundService.getCurrentRound(itemData.rfxId);

    const vendorId = req.user.organization.id;
    const solRegistration = await manager
      .getRepository(SolRegistration)
      .findOne({
        where: {
          rfxId: itemData.rfxId,
          vendorId,
        },
      });

    if (!solRegistration) {
      throw new BadRequestException('Solicitation Registration Not Found');
    }

    const isPasswordValid = this.encryptionHelperService.checkPasswordValidity(
      solRegistration,
      '123456',
    );

    if (!isPasswordValid) {
      throw new BadRequestException('invalid password');
    }

    const preSignedResponse = [];
    const responseItem = [];

    for (const item of itemData.responses) {
      const url = await this.minIoService.generatePresignedUploadUrl(
        item.fileInfo,
        'marketplace',
      );

      preSignedResponse.push({
        rfxDocumentaryEvidenceId: item.rfxDocumentaryEvidenceId,
        preSignedUrl: url.presignedUrl,
      });

      const encryptedFileInfo = this.encryptionHelperService.encryptData(
        JSON.stringify(url.file),
        '123456',
        solRegistration.salt,
      );

      const response = this.solResponseRepository.create({
        rfxId: itemData.rfxId,
        solRegistrationId: solRegistration.id,
        rfxDocumentaryEvidenceId: item.rfxDocumentaryEvidenceId,
        vendorId: req.user.organization.id,
        value: encryptedFileInfo,
      });

      responseItem.push(response);
    }

    const item = this.solResponseRepository.create(responseItem);

    await this.solResponseRepository.upsert(item, {
      conflictPaths: {
        solRegistrationId: true,
        rfxDocumentaryEvidenceId: true,
        rfxId: true,
      },
    });
    return preSignedResponse;
  }

  async getDocument(
    rfxId: string,
    rfxDocumentaryEvidenceId: string,
    solRegistrationId: string,
  ) {
    const resposne = await this.openedResponseRepository.findOne({
      where: {
        rfxId,
        rfxDocumentaryEvidenceId: rfxDocumentaryEvidenceId,
        solRegistrationId,
      },
      select: {
        id: true,
        value: true,
      },
    });

    if (!resposne) {
      throw new BadRequestException('Document Not Found');
    }

    const presignedUrl = await this.minIoService.generatePresignedDownloadUrl(
      resposne.value,
    );

    return { presignedUrl };
  }
}
