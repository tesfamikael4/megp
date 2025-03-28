import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Not, Repository } from 'typeorm';
import { EntityCrudService } from 'src/shared/service';
import { PreferentialTreatmentsEntity } from 'src/entities/preferential-treatment.entity';
import { v4 as uuidv4 } from 'uuid';
import { WorkflowService } from 'src/modules/bpm/services/workflow.service';
import {
  CreateWorkflowInstanceDto,
  GotoNextStateDto,
} from 'src/modules/handling/dto/workflow-instance.dto';
import { BusinessProcessService } from 'src/modules/bpm/services/business-process.service';
import {
  BusinessAreaEntity,
  IsrVendorsEntity,
  VendorsEntity,
} from 'src/entities';
import { BusinessAreaService } from 'src/modules/vendor-registration/services/business-area.service';
import { FileService } from 'src/modules/vendor-registration/services/file.service';
import { ServiceKeyEnum } from 'src/shared/enums/service-key.enum';
import { ApplicationStatus } from 'src/modules/handling/enums/application-status.enum';
import { HandlingCommonService } from 'src/modules/handling/services/handling-common-services';
import { BpServiceService } from 'src/modules/services/services/service.service';
import { CreatePTDto } from '../dto/preferentail-treatment.dto';
import PdfDocumentTemplate from 'src/modules/certificates/templates/pdf-tamplate';
import { Readable } from 'typeorm/platform/PlatformTools';

@Injectable()
export class PreferentailTreatmentService extends EntityCrudService<PreferentialTreatmentsEntity> {
  constructor(
    @InjectRepository(PreferentialTreatmentsEntity)
    private readonly ptRepository: Repository<PreferentialTreatmentsEntity>,
    private readonly workflowService: WorkflowService,
    private readonly bpService: BusinessProcessService,
    @InjectRepository(IsrVendorsEntity)
    private readonly srRepository: Repository<IsrVendorsEntity>,
    @InjectRepository(VendorsEntity)
    private readonly vendorRepository: Repository<VendorsEntity>,
    private readonly baService: BusinessAreaService,
    private readonly uploaderService: FileService,
    private readonly commonService: HandlingCommonService,
    private readonly serviceService: BpServiceService,
    private readonly fileService: FileService,
  ) {
    super(ptRepository);
  }
  async getPreferentialTreatments(keys: string[], userId: string) {
    const result = await this.ptRepository.find({
      relations: { service: true },
      where: { service: { key: In(keys) }, userId: userId },
    });
    return result;
  }
  async getPreferentialTreatmentsByUserId(serviceId: string, userId: string) {
    const result = await this.ptRepository.find({
      relations: { service: true },
      where: {
        userId: userId,
        status: Not(
          In([
            ApplicationStatus.APPROVED,
            ApplicationStatus.REJECTED,
            ApplicationStatus.DRAFT,
          ]),
        ),
        // serviceId: serviceId,
      },
    });
    return result;
  }
  async getMyPreferentialTreatments(userId: string) {
    const result = await this.ptRepository.find({
      relations: { service: true },
      where: {
        userId: userId,
        status: ApplicationStatus.APPROVED,
      },
    });
    const keys = this.commonService.getServiceCatagoryKeys(ServiceKeyEnum.MSME);
    const response = [];
    for (const row of result) {
      if (keys.some((item: any) => row.service.key == item)) {
        response.push({
          certiNumber: row.certiNumber,
          category: ServiceKeyEnum.MSME,
          type: row.service.key,
          certificateUrl: row.certificateUrl,
          certificateValidityPeriod: row.certificateValidityPeriod,
          certificateIssuedDate: row.certificateIssuedDate,
        });
      } else {
        response.push({
          certiNumber: row.certiNumber,
          category: row.service.key,
          type: row.service.key,
          certificateUrl: row.certificateUrl,
          certificateValidityPeriod: row.certificateValidityPeriod,
          certificateIssuedDate: row.certificateIssuedDate,
        });
      }
    }
    return response;
  }
  async generatePDFForReview(data: any, user: any, title: string) {
    try {
      const subfolder = 'application-doc';
      const result = await PdfDocumentTemplate({ ...data, title: title });
      const readStream = new Readable().wrap(result);
      const fileId = await this.fileService.uploadReadable(
        readStream,
        user.id,
        subfolder,
      );

      if (!(result instanceof Readable)) {
        throw new Error(
          'Certificate function did not return a Readable stream',
        );
      }
      return fileId;
    } catch (error) {
      console.error('Error:', error);
      throw new Error('Internal Server Error' + error);
    }
  }
  async getSubmittedPTByUserId(
    userId: any,
  ): Promise<PreferentialTreatmentsEntity[]> {
    const result = await this.ptRepository.find({
      relations: { service: true },
      where: { userId: userId, status: ApplicationStatus.SUBMITTED },
    });
    return result;
  }
  async getPreviousPTByUserId(
    userId: any,
    serviceIds: string[],
  ): Promise<PreferentialTreatmentsEntity[]> {
    const result = await this.ptRepository.find({
      relations: { service: true },
      where: {
        userId: userId,
        status: ApplicationStatus.APPROVED,
        service: In(serviceIds),
      },
    });
    return result;
  }

  //otherDocuments: Express.Multer.File[]
  getServiceKey(item) {
    item.service.key == ServiceKeyEnum.IBM;
  }
  private async deletePendingPreferentialData(userId: string) {
    await this.ptRepository.createQueryBuilder()
      .delete()
      .where({ userId: userId, status: ApplicationStatus.PENDING })
      .execute();
  }
  async submitPreferential(
    dtos: CreatePTDto[],
    user: any,
    instanceId: string = null,
    applicationNumber = null,
  ) {
    let data: any = {};
    const title = 'Registration of Preferential Treatment Application';
    let vendor: any = await this.vendorRepository.findOne({
      where: { userId: user.id },
      relations: {
        beneficialOwnershipShareholders: true,
        vendorAccounts: true,
        areasOfBusinessInterest: { price: true },
      },
    });
    if (!vendor) {
      vendor = await this.srRepository.findOne({
        where: { userId: user.id },
      });
      data = vendor;
    } else {
      data = {
        bankAccountDetails: vendor.vendorAccounts,
        beneficialOwnershipShareholders: vendor.beneficialOwnershipShareholders,
        businessSizeAndOwnership: vendor.metaData.businessSizeAndOwnership,
        areasOfBusinessInterest: vendor.areasOfBusinessInterest,
        basic: {
          name: vendor.name,
          formOfEntity: vendor.formOfEntity,
          countryOfRegistration: vendor.countryOfRegistration,
          tinNumber: vendor.tinNumber,
          registrationNumber: vendor.registrationNumber,
          status: vendor.status,
        },
        address: vendor.metaData.address,
        contactPersons: vendor.metaData.contactPersons,
        lineOfBusiness: [...vendor.lineOfBusiness],
      };
    }

    if (!vendor) throw new HttpException('First, Register as a vendor', 404);

    this.deletePendingPreferentialData(user.id);

    const serviceIds = dtos.map((item) => item.serviceId);
    const bps = await this.bpService.findBpWithServiceByServiceIds(serviceIds);



    for (const dto of dtos) {

      const entity = CreatePTDto.fromDto(dto);
      entity.userId = user.id;
      const wf = bps.find((item: any) => item.serviceId == dto.serviceId);
      if (!wf) throw new HttpException('Business procees not defined', 404);
      const bpId = wf.id;
      try {
        entity.status =
          dto.status == ApplicationStatus.DRAFT
            ? ApplicationStatus.DRAFT
            : ApplicationStatus.SUBMITTED;
        const existedRequest = await this.ptRepository.findOne({
          where: {
            serviceId: dto.serviceId,
            userId: user.id,
            status: In([ApplicationStatus.SUBMITTED, ApplicationStatus.DRAFT]),
          },
        });
        if (existedRequest) {
          entity.id = existedRequest.id;
        }
        await this.ptRepository.save(entity);
        if (
          dto.status == ApplicationStatus.SUBMIT ||
          instanceId != undefined ||
          instanceId != null
        ) {
          const wfi = new CreateWorkflowInstanceDto();
          wfi.bpId = bpId;
          wfi.requestorId = vendor.id;
          wfi.serviceId = dto.serviceId;
          const { serviceId, id, ...preferential } = entity;
          const ptServices = await this.ptRepository.find({
            where: {
              status: ApplicationStatus.APPROVED,
              userId: user.id,
              service: {
                key: In(this.commonService.getPreferentialServices()),
              },
            },
            relations: { service: true },
          });
          data.preferential = [...ptServices];
          data.preferentialRequests = [];
          data.preferentialRequests.push(preferential);
          const formattedData = await this.formatData(data);
          const documentId = await this.generatePDFForReview(
            formattedData,
            user,
            title,
          );
          const fileId = uuidv4();
          wfi.data = {
            ...formattedData,
            documentId: documentId,
            fileId: fileId,
          };
          wfi.user = user;
          const baexisted =
            await this.baService.getUserInprogressBusinessAreaByServiceId(
              dto.serviceId,
              user.id,
            );
          if (
            baexisted?.status == ApplicationStatus.ADJUSTMENT &&
            instanceId == null
          ) {
            const nextCommand = new GotoNextStateDto();
            nextCommand.instanceId = baexisted.instanceId;
            nextCommand.action = 'ISR';

            nextCommand.data = {
              ...formattedData,
              documentId: documentId,
              fileId: fileId,
              preferential: { ...preferential },
            };
            // nextCommand.data = wfi.data;
            return await this.workflowService.gotoNextStep(nextCommand, user);
          } else if (
            baexisted?.status == ApplicationStatus.ADJUSTMENT &&
            instanceId != null
          ) {
            baexisted.status = ApplicationStatus.PENDING;
            this.baService.update(baexisted.id, baexisted);
            continue;
          }
          const baEnt = new BusinessAreaEntity();
          baEnt.vendorId = vendor?.id;
          baEnt.category = ServiceKeyEnum.PREFERENTIAL_TREATMENT;
          baEnt.status = ApplicationStatus.PENDING;
          baEnt.serviceId = dto.serviceId;
          if (!instanceId) {
            const wfiResult =
              await this.workflowService.intiateWorkflowInstance(wfi, user);
            baEnt.applicationNumber = wfiResult.application.applicationNumber;
            baEnt.instanceId = wfiResult.application.id;
          } else {
            baEnt.instanceId = instanceId;
            baEnt.applicationNumber = applicationNumber;
          }
          await this.baService.create(baEnt);
        }
      } catch (error) {
        throw new HttpException(error, 500);
      }
    }

    return true;
  }
  async submitPreferentialWithInitialRegistration(
    dtos: CreatePTDto[],
    user: any,
    instanceId: string,
    applicationNumber: string,
  ) {
    for (const dto of dtos) {
      let existedRequest = null;
      try {
        existedRequest = await this.ptRepository.findOne({
          where: {
            serviceId: dto.serviceId,
            userId: user.id,
            status: In([ApplicationStatus.SUBMITTED, ApplicationStatus.DRAFT]),
          },
        });
        if (!existedRequest) {
          existedRequest = await this.ptRepository.findOne({
            where: {
              serviceId: dto.serviceId,
              userId: user.id,
              status: ApplicationStatus.ADJUSTMENT,
            },
          });
        }

        if (!existedRequest) {
          throw new NotFoundException('Preferential_request_not_drafted');
        }

        existedRequest.status = ApplicationStatus.SUBMITTED;
        await this.ptRepository.save(existedRequest);

        const baexisted =
          await this.baService.getUserInprogressBusinessAreaByServiceId(
            dto.serviceId,
            user.id,
          );
        if (baexisted?.status == ApplicationStatus.ADJUSTMENT) {
          baexisted.status = ApplicationStatus.PENDING;
          this.baService.update(baexisted.id, baexisted);
          continue;
        } else {
          const baEnt = new BusinessAreaEntity();
          const vendor = await this.srRepository.findOne({
            where: { userId: user.id },
          });
          baEnt.vendorId = vendor?.id;
          baEnt.category = ServiceKeyEnum.PREFERENTIAL_TREATMENT;
          baEnt.status = ApplicationStatus.PENDING;
          baEnt.serviceId = dto.serviceId;
          baEnt.instanceId = instanceId;
          baEnt.applicationNumber = applicationNumber;
          await this.baService.create(baEnt);
        }
      } catch (error) {
        throw new HttpException(error, 500);
      }
    }

    return true;
  }

  //price
  async formatData(data: any) {
    delete data.basic?.address;
    const formattedData: any = { ...data };
    formattedData.areasOfBusinessInterest = [];
    for (const ba of data.areasOfBusinessInterest) {
      if (ba.price) {
        const bi = {
          category: ba.category,
          lineOfBusiness: ba.lineOfBusiness?.map((lob: any) => lob.name),
          priceRange: this.commonService.formatPriceRange(ba.price),
        };
        formattedData.areasOfBusinessInterest.push(bi);
      }
    }

    formattedData.bankAccountDetails = [];
    for (const bank of data.bankAccountDetails) {
      const formatted = this.commonService.reduceAttributes(bank);
      const isDefault = formatted.isDefault ? 'Yes' : 'No';
      formatted.isDefault = isDefault;
      formattedData.bankAccountDetails.push(formatted);
    }
    //new model changes
    formattedData.beneficialOwnershipShareholders = [];
    for (const share of data?.beneficialOwnershipShareholders) {
      const formatted = this.commonService.reduceAttributes(share);
      formattedData.beneficialOwnershipShareholders.push(formatted);
    }
    //new model changes
    formattedData.businessSizeAndOwnership =
      this.commonService.reduceAttributes(data?.businessSizeAndOwnership);

    formattedData.preferential = [];
    for (const pt of data?.preferential ?? []) {
      const formatted = this.commonService.reduceAttributes(pt);
      formattedData.preferential.push(formatted);
    }
    formattedData.address = this.commonService.orderAddress(data.address);
    formattedData.basic = this.commonService.orderVendorBasicInformation(
      data.basic,
    );

    return formattedData;
  }

  async uploadPreferentialAttachments(attachments: any, user: any) {
    const subdirectory = 'preferential-documents';
    const response = {};
    const vendor = await this.srRepository.findOne({ where: { userId: user.id } });
    if (!vendor)
      throw new NotFoundException("Not Registered");
    try {
      if (attachments?.msmeCerti?.length) {
        const certificateUrl = await this.uploaderService.uploadDocuments(
          attachments.msmeCerti[0],
          user,
          subdirectory,
        );
        const keys = this.commonService.getServiceCatagoryKeys(
          ServiceKeyEnum.MSME,
        );
        const pt = await this.ptRepository.findOne({
          where: {
            service: {
              key: In(keys),
            },
            status: In([ApplicationStatus.SUBMITTED, ApplicationStatus.DRAFT]),
            userId: user.id,
          },
        });
        if (pt) {
          pt.certificateUrl = certificateUrl;
          await this.ptRepository.save(pt);
          response['msmeCerti'] = certificateUrl;
        } else {
          throw new HttpException('MSME data Not found', 404);
        }
      }
      if (attachments?.ibmCerti?.length) {
        const certificateUrl = await this.uploaderService.uploadDocuments(
          attachments.ibmCerti[0],
          user,
          subdirectory,
        );
        const pt = await this.ptRepository.findOne({
          where: {
            service: { key: ServiceKeyEnum.IBM },
            status: In([ApplicationStatus.SUBMITTED, ApplicationStatus.DRAFT]),
            userId: user.id,
          },
        });
        if (pt) {
          pt.certificateUrl = certificateUrl;
          await this.ptRepository.save(pt);
          response['ibmCerti'] = certificateUrl;
        } else {
          throw new HttpException('IBM data Not found', 404);
        }
      }
      if (attachments?.marginalizedCerti?.length) {
        const certificateUrl = await this.uploaderService.uploadDocuments(
          attachments.marginalizedCerti[0],
          user,
          subdirectory,
        );
        const pt = await this.ptRepository.findOne({
          where: {
            service: { key: ServiceKeyEnum.MARGINALIZED_GROUP },
            status: In([ApplicationStatus.SUBMITTED, ApplicationStatus.DRAFT]),
            userId: user.id,
          },
        });
        if (pt) {
          pt.certificateUrl = certificateUrl;
          await this.ptRepository.save(pt);
          response['marginalizedCerti'] = certificateUrl;
        } else {
          throw new HttpException('marginalized Data Not found', 404);
        }
      }
      return response;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getDraftPreferentialApplications(user: any) {
    const response = [];
    const result = await this.ptRepository.find({
      relations: { service: true },
      where: { userId: user.id, status: ApplicationStatus.DRAFT },
    });

    const keys = this.commonService.getServiceCatagoryKeys(ServiceKeyEnum.MSME);
    for (const row of result) {
      if (row.service.key == ServiceKeyEnum.IBM) {
        response.push({
          ...row,
          category: row.service.key,
          type: row.service.key,
        });
      } else if (row.service.key == ServiceKeyEnum.MARGINALIZED_GROUP) {
        response.push({
          ...row,
          category: row.service.key,
          type: row.service.key,
        });
      } else if (
        keys.filter((item: any) => row.service.key == item.service.key).length >
        0
      ) {
        response.push({
          ...row,
          category: ServiceKeyEnum.MSME,
          type: row.service.key,
        });
      }
    }
    return response;
  }
  async getPreferntialByService(serviceId: string, userId: string) {
    const result = await this.ptRepository.findOne({
      relations: { service: true },
      where: {
        userId: userId,
        serviceId: serviceId,
        status: ApplicationStatus.SUBMIT,
      },
    });
    return result;
  }
  async delete(id: string, user: any) {
    return await this.ptRepository.delete({ id: id, userId: user.id });
  }
  async getUnregisteredPreferentials(user: any) {
    const result = await this.ptRepository.find({
      relations: { service: true },
      where: { userId: user.id },
    });
    let keys = [];
    for (const item of result) {
      if (
        item.service.key == ServiceKeyEnum.MEDIUM ||
        item.service.key == ServiceKeyEnum.MICRO ||
        item.service.key == ServiceKeyEnum.SMALL
      ) {
        keys = [
          ...this.commonService.getServiceCatagoryKeys(ServiceKeyEnum.MSME),
        ];
      }
      keys.push(item.service.key);
    }
    const services =
      await this.serviceService.getPreferentialTreatmentByKeys(keys);
    return services;
  }

  async saveAll(pts: PreferentialTreatmentsEntity[]) {
    return this.ptRepository.save(pts);
  }
}
