import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { EntityCrudService } from 'src/shared/service';
import { PreferentialTreatmentsEntity } from 'src/entities/preferential-treatment.entity';
import { CreatePTDto } from '../dto/preferentail-treatment.dto';
import { WorkflowService } from 'src/modules/bpm/services/workflow.service';
import { CreateWorkflowInstanceDto } from 'src/modules/handling/dto/workflow-instance.dto';
import { BusinessProcessService } from 'src/modules/bpm/services/business-process.service';
import { VendorRegistrationsService } from 'src/modules/vendor-registration/services/vendor-registration.service';
@Injectable()
export class PreferentailTreatmentService extends EntityCrudService<PreferentialTreatmentsEntity> {
    constructor(
        @InjectRepository(PreferentialTreatmentsEntity)
        private readonly ptRepository: Repository<PreferentialTreatmentsEntity>,
        private readonly workflowService: WorkflowService,
        private readonly bpService: BusinessProcessService,
        private readonly vendorService: VendorRegistrationsService
    ) {
        super(ptRepository);
    }
    async getPreferetialTreatments(keys: string[], user: any) {
        const result = await this.ptRepository.find({
            relations: { service: true, vendor: true },
            where: { service: { key: In(keys) } }
        })
        return result;

    }
    async submitPreferential(dto: CreatePTDto, user: any) {
        const entity = CreatePTDto.fromDto(dto);
        const pt = await this.ptRepository.save(entity);
        const wfi = new CreateWorkflowInstanceDto();
        const bp = await this.bpService.findBpWithServiceByServiceId(dto.serviceId);
        if (!bp) throw new NotFoundException("Business Process Not Defined")
        const vendor = await this.vendorService.getVendorByUserId(user.id);
        if (!vendor) throw new NotFoundException("Please register as a vendor")
        wfi.bpId = bp.id;
        wfi.requestorId = vendor.isrvendorId;
        wfi.serviceId = dto.serviceId;
        wfi.data = { vendor: vendor, extendedProfile: dto.extendedProfile, attachments: dto.attachments, remark: dto.remark };
        wfi.user = user;
        const wfiResult = this.workflowService.intiateWorkflowInstance(wfi, user);
        if (wfiResult) {
            // will be implemented later
        }


    }

}
