import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { EntityCrudService } from 'src/shared/service';
import { PreferentialTreatmentsEntity } from 'src/entities/preferential-treatment.entity';
import { CreatePTDto } from '../dto/preferentail-treatment.dto';
import { WorkflowService } from 'src/modules/bpm/services/workflow.service';
import {
  CreateWorkflowInstanceDto,
  GotoNextStateDto,
} from 'src/modules/handling/dto/workflow-instance.dto';
import { BusinessProcessService } from 'src/modules/bpm/services/business-process.service';
import { VendorRegistrationsService } from 'src/modules/vendor-registration/services/vendor-registration.service';
import { BusinessAreaEntity } from 'src/entities';
import { BusinessAreaService } from 'src/modules/vendor-registration/services/business-area.service';
import { FileService } from 'src/modules/vendor-registration/services/file.service';
import { ServiceKeyEnum } from 'src/shared/enums/service-key.enum';
import { ApplicationStatus } from 'src/modules/handling/enums/application-status.enum';
import { HandlingCommonService } from 'src/modules/handling/services/handling-common-services';
@Injectable()
export class PreferentailTreatmentService extends EntityCrudService<PreferentialTreatmentsEntity> {
  constructor(
    @InjectRepository(PreferentialTreatmentsEntity)
    private readonly ptRepository: Repository<PreferentialTreatmentsEntity>,
    private readonly workflowService: WorkflowService,
    private readonly bpService: BusinessProcessService,
    private readonly vendorService: VendorRegistrationsService,
    private readonly baService: BusinessAreaService,
    private readonly uploaderService: FileService,
    private readonly commonService: HandlingCommonService,
    // private readonly serviceService: BpServiceService
  ) {
    super(ptRepository);
  }
  async getPreferetialTreatments(keys: string[], user: any) {
    const result = await this.ptRepository.find({
      relations: { service: true, vendor: true },
      where: { service: { key: In(keys) }, userId: user.id },
    });
    return result;
  }
  //otherDocuments: Express.Multer.File[]
  getServiceKey(item) {
    item.service.key == ServiceKeyEnum.IBM;
  }
  async submitPreferential(
    dtos: CreatePTDto[],
    user: any
  ) {
    const response = [];
    const subdirectory = 'preferential-documents';
    const vendor = await this.vendorService.getVendor(user.id);
    if (!vendor)
      throw new HttpException('First, Register as a vendor', 404);
    const serviceIds = dtos.map((item) => item.serviceId);
    const bps = await this.bpService.findBpWithServiceByServiceIds(serviceIds);
    for (const dto of dtos) {
      const entity = CreatePTDto.fromDto(dto);
      entity.userId = user.id;
      entity.vendorId = vendor.id;
      const wf = bps.find((item: any) => item.serviceId == dto.serviceId)
      if (!wf)
        throw new HttpException("Business procees not defined", 404);
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
        if (dto.status == ApplicationStatus.SUBMIT) {
          const wfi = new CreateWorkflowInstanceDto();
          wfi.bpId = bpId;
          wfi.requestorId = vendor.id;
          wfi.serviceId = dto.serviceId;
          const { serviceId, vendorId, id, ...preferntial } = entity;
          wfi.data = { vendor: vendor, preferential: { ...preferntial } };
          wfi.user = user;
          const baexisted =
            await this.baService.getUserInprogressBusinessAreaByServiceId(
              dto.serviceId,
              user.id,
            );
          if (baexisted) {
            const nextCommand = new GotoNextStateDto();
            nextCommand.instanceId = baexisted.instanceId;
            nextCommand.action = 'ISR';
            nextCommand.data = wfi.data;
            return await this.workflowService.gotoNextStep(nextCommand, user);
          }
          const wfiResult =
            await this.workflowService.intiateWorkflowInstance(wfi, user);
          const ba = new BusinessAreaEntity();
          ba.instanceId = wfiResult.application.id;
          ba.vendorId = vendor?.id;
          ba.category = ServiceKeyEnum.preferentialTreatment;
          ba.applicationNumber = wfiResult.application.applicationNumber;
          ba.status = ApplicationStatus.PENDING;
          ba.serviceId = dto.serviceId;
          await this.baService.create(ba);
        }
        const pts = await this.ptRepository.find({
          relations: { service: true },
          where: { serviceId: In(serviceIds), userId: user.id },
        });
        for (const row of pts) {
          if ((row.service.key == ServiceKeyEnum.IBM)) {
            response.push({
              ...row,
              category: row.service.key,
              type: row.service.key,
            });
          }
          if ((row.service.key = ServiceKeyEnum.MARGINALIZED_GROUP)) {
            response.push({
              ...row,
              category: row.service.key,
              type: row.service.key,
            });
          }
          const keys = this.commonService.getServiceCatagoryKeys(
            ServiceKeyEnum.MSME,
          );
          if (keys.filter((item: any) => row.service.key == item.service.key).length > 0) {
            response.push({
              ...row,
              category: ServiceKeyEnum.MSME,
              type: row.service.key,
            });
          }
        }

        return response;
      } catch (error) {
        throw new HttpException(error, 500);
      }
    }
  }
  async uploadPreferentialAttachments(attachments: any, user: any) {
    const subdirectory = 'preferential-documents';
    const response = {};
    try {
      if (attachments.msmeCerti.length > 0) {
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
            status: ApplicationStatus.SUBMITTED,
            userId: user.id,
          },
        });
        pt.certificateUrl = certificateUrl;
        await this.ptRepository.save(pt);
        response['msmeCerti'] = certificateUrl;
      }
      if (attachments.ibmCerti.length > 0) {
        const certificateUrl = await this.uploaderService.uploadDocuments(
          attachments.ibmCerti[0],
          user,
          subdirectory,
        );
        const pt = await this.ptRepository.findOne({
          where: {
            service: { key: ServiceKeyEnum.IBM },
            status: ApplicationStatus.SUBMITTED,
            userId: user.id,
          },
        });
        pt.certificateUrl = certificateUrl;
        await this.ptRepository.save(pt);
        response['ibmCerti'] = certificateUrl;
      }
      if (attachments.marginalizedCerti.length > 0) {
        const certificateUrl = await this.uploaderService.uploadDocuments(
          attachments.marginalizedCerti[0],
          user,
          subdirectory,
        );
        const pt = await this.ptRepository.findOne({
          where: {
            service: { key: ServiceKeyEnum.MARGINALIZED_GROUP },
            status: ApplicationStatus.SUBMITTED,
            userId: user.id,
          },
        });
        pt.certificateUrl = certificateUrl;
        await this.ptRepository.save(pt);
        response['marginalizedCerti'] = certificateUrl;
      }
      return response;
    } catch (error) {
      throw new Error(error);
    }
  }
  async getDraftPreferentialApplications(user: any) {
    const response = []
    const result = await this.ptRepository.find({
      relations: { service: true, vendor: true },
      where: { userId: user.id, status: ApplicationStatus.DRAFT },
    });
    const keys = this.commonService.getServiceCatagoryKeys(
      ServiceKeyEnum.MSME,
    );
    for (const row of result) {
      if ((row.service.key == ServiceKeyEnum.IBM)) {
        response.push({
          ...row,
          category: row.service.key,
          type: row.service.key,
        });
      } else if ((row.service.key == ServiceKeyEnum.MARGINALIZED_GROUP)) {
        response.push({
          ...row,
          category: row.service.key,
          type: row.service.key,
        });
      } else
        if (keys.filter((item: any) => row.service.key == item.service.key).length > 0) {
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
      relations: { service: true, vendor: true },
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
}
