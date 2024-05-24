import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ENTITY_MANAGER_KEY,
  ExtraCrudService,
  MinIOService,
} from 'megp-shared-be';
import { SolRegistration, SolResponse } from 'src/entities';
import { EntityManager, Repository } from 'typeorm';
import { CreateSolResponseDto } from '../dtos/response.dto';
import { REQUEST } from '@nestjs/core';
import { EncryptionHelperService } from './encryption-helper.service';
import { SolRoundService } from './round.service';

@Injectable()
export class SolResponseService extends ExtraCrudService<SolResponse> {
  constructor(
    @InjectRepository(SolResponse)
    private readonly solResponseRepository: Repository<SolResponse>,
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

      preSignedResponse.push({ key: item.key, preSignedUrl: url.presignedUrl });

      const encryptedFileInfo = this.encryptionHelperService.encryptData(
        JSON.stringify(item.fileInfo),
        '123456',
        solRegistration.salt,
      );

      const response = this.solResponseRepository.create({
        rfxId: itemData.rfxId,
        solRegistrationId: solRegistration.id,
        key: item.key,
        vendorId: req.user.organization.id,
        value: encryptedFileInfo,
      });

      responseItem.push(response);
    }

    const item = this.solResponseRepository.create(responseItem);

    await this.solResponseRepository.upsert(item, ['key', 'vendorId', 'rfxId']);
    return preSignedResponse;
  }

  async reviewResonses(rfxId: string, vendorId: string) {
    // Check Viewing Response is allowed - Date Validation

    const solRegistration = await this.solRegistrationRepository.findOne({
      where: {
        rfxId,
        vendorId,
      },
      relations: {
        solResponses: true,
      },
    });

    if (!solRegistration)
      throw new BadRequestException('Registration Not Found');

    const isPasswordValid = this.encryptionHelperService.checkPasswordValidity(
      solRegistration,
      '123456',
    );

    if (!isPasswordValid) throw new BadRequestException('invalid password');

    const fileInfos = [];

    for (const resp of solRegistration.solResponses) {
      const fileInfo = this.encryptionHelperService.decryptedData(
        resp.value,
        '123456',
        solRegistration.salt,
      );
      const x = JSON.parse(fileInfo);
      const presignedUrl =
        await this.minIoService.generatePresignedDownloadUrl(x);
      fileInfos.push({ key: resp.key, presignedUrl });
    }

    return fileInfos;
  }
}
