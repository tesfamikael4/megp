import { BadRequestException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { EntityCrudService } from 'src/shared/service';
import { PreferentialTreatmentsEntity } from 'src/entities/preferential-treatment.entity';
import { CreatePTDto } from '../dto/preferentail-treatment.dto';
import { WorkflowService } from 'src/modules/bpm/services/workflow.service';
import { CreateWorkflowInstanceDto } from 'src/modules/handling/dto/workflow-instance.dto';
import { BusinessProcessService } from 'src/modules/bpm/services/business-process.service';
import { VendorRegistrationsService } from 'src/modules/vendor-registration/services/vendor-registration.service';
import { BusinessAreaEntity } from 'src/entities';
import { BusinessAreaService } from 'src/modules/vendor-registration/services/business-area.service';
import { FileService } from 'src/modules/vendor-registration/services/file.service';
import { ServiceKeyEnum } from 'src/shared/enums/service-key.enum';
import { ApplicationStatus } from 'src/modules/handling/enums/application-status.enum';
@Injectable()
export class PreferentailTreatmentService extends EntityCrudService<PreferentialTreatmentsEntity> {
    constructor(
        @InjectRepository(PreferentialTreatmentsEntity)
        private readonly ptRepository: Repository<PreferentialTreatmentsEntity>,
        private readonly workflowService: WorkflowService,
        private readonly bpService: BusinessProcessService,
        private readonly vendorService: VendorRegistrationsService,
        private readonly baService: BusinessAreaService,
        private readonly uploaderService: FileService
    ) {
        super(ptRepository);
    }
    async getPreferetialTreatments(keys: string[], user: any) {
        const result = await this.ptRepository.find({
            relations: { service: true, vendor: true },
            where: { service: { key: In(keys) }, userId: user.id }
        })
        return result;
    }
    //otherDocuments: Express.Multer.File[]
    async submitPreferential(
        attachments: any,
        dto: CreatePTDto,
        user: any) {
        const subdirectory = 'preferential-documents';
        const fileNames = [];
        const entity = CreatePTDto.fromDto(dto);
        entity.userId = user.id;
        const vendor = await this.vendorService.getVendor(user.id);
        if (vendor)
            entity.vendorId = vendor.id;
        else
            throw new HttpException("First, Register as a vendor", 400);
        if (attachments.certificate) {
            const certificateUrl = await this.uploaderService.uploadDocuments(attachments.certificate[0], user, subdirectory);
            entity.certificateUrl = certificateUrl;
        }
        else {
            throw new HttpException("Please upload the ceriteficate", 400);
        }
        if (attachments.otherDocuments?.length > 0) {
            for (const doc of attachments.otherDocuments) {
                const filename = await this.uploaderService.uploadDocuments(doc, user, subdirectory);
                fileNames.push({ 'fileId': filename, 'label': doc.fieldname });
            }
            entity.otherDocuments = fileNames;
        }
        try {
            entity.status = dto.status == ApplicationStatus.DRAFT ? ApplicationStatus.DRAFT : ApplicationStatus.SUBMITTED;
            const existedRequest = await this.ptRepository.find({ where: { serviceId: dto.serviceId, userId: user.id, status: In([ApplicationStatus.SUBMITTED, ApplicationStatus.DRAFT]) } });
            if (existedRequest?.length > 0) {
                entity.id = existedRequest[0].id;
            }

            const result = await this.ptRepository.save(entity);
            if (dto.status == ApplicationStatus.SUBMIT) {
                const wfi = new CreateWorkflowInstanceDto();
                const bp = await this.bpService.findBpWithServiceByServiceId(dto.serviceId);
                if (!bp) throw new NotFoundException("Business Process Not Defined")
                const vendor = await this.vendorService.getVendorByUserId(user.id);
                if (!vendor) throw new BadRequestException("Please register as a vendor")
                wfi.bpId = bp.id;
                wfi.requestorId = vendor.vendor?.id;
                wfi.serviceId = dto.serviceId;
                wfi.data = { vendor: vendor, extendedProfile: dto.extendedProfile, attachments: fileNames, remark: dto.remark };
                wfi.user = user;
                const wfiResult = await this.workflowService.intiateWorkflowInstance(wfi, user);
                const ba = new BusinessAreaEntity();
                ba.instanceId = wfiResult.application.id;
                ba.vendorId = vendor.vendor?.id;
                ba.category = ServiceKeyEnum.preferentialTreatment;
                ba.applicationNumber = wfiResult.application.applicationNumber;
                ba.status = ApplicationStatus.PENDING;
                ba.serviceId = dto.serviceId;
                await this.baService.create(ba);
                return wfiResult;
            }
            return result;
        } catch (error) {
            throw new HttpException(error, 500);
        }
    }

    async getDraftPreferentialApplications(user: any) {
        const result = await this.ptRepository.find({
            relations: { service: true, vendor: true },
            where: { userId: user.id, status: ApplicationStatus.DRAFT }
        })
        return result;
    }


    async delete(id: string, user: any) {
        return await this.ptRepository.delete({ id: id, userId: user.id });
    }




}
