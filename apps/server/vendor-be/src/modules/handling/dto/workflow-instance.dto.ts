import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { BusinessAreaEntity, IsrVendorsEntity } from 'src/entities';
import { PreferentialTreatmentsEntity } from 'src/entities/preferential-treatment.entity';
import { ProfileInfoEntity } from 'src/entities/profile-info.entity';
import { ServicePrice } from 'src/entities/service-price.entity';
import { WorkflowInstanceEntity } from 'src/entities/workflow-instance.entity';
import { BusinessProcessResponse } from 'src/modules/bpm/dto/business-process.dto';
import { TaskCheckListDto } from 'src/modules/bpm/dto/task-check-list.dto';
import { TaskHandlerResponse } from 'src/modules/bpm/dto/task-handler.dto';
import { TaskTrackerResponse } from 'src/modules/bpm/dto/task-tracker.dto';
import { TaskResponse } from 'src/modules/bpm/dto/task.dto';
import { BpServiceResponse } from 'src/modules/services/dto/bp-service.dto';

export class CreateWorkflowInstanceDto {
  @ApiProperty()
  @IsNotEmpty()
  requestorId: string;
  @ApiProperty()
  @IsNotEmpty()
  status: string;
  @ApiProperty()
  @IsOptional()
  serviceId: string;
  @ApiProperty()
  @IsOptional()
  bpId: string;
  @ApiProperty()
  @IsOptional()
  pricingId: string;
  createdBy: string;
  @ApiProperty()
  @IsOptional()
  data?: any;
  user: any;
  /**
   * Transfer Data from DTO object to Entity object
   *
   **/
  static fromDto(dto: CreateWorkflowInstanceDto): WorkflowInstanceEntity {
    const entity = new WorkflowInstanceEntity();
    if (!dto) {
      return null;
    }
    entity.requestorId = dto.requestorId;
    entity.bpId = dto.bpId;
    entity.serviceId = dto.serviceId;
    entity.status = dto?.status;
    entity.submittedAt = new Date();
    return entity;
  }

  /**
   * Transfer list of DTO object to Entity  list
   *
   */
  static fromDtos(dto: CreateWorkflowInstanceDto[]): WorkflowInstanceEntity[] {
    return dto?.map((d) => CreateWorkflowInstanceDto.fromDto(d));
  }
}
export class UpdateWorkflowInstanceDto extends CreateWorkflowInstanceDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  id: string;
  user: any;
  static fromDto(dto: UpdateWorkflowInstanceDto): WorkflowInstanceEntity {
    const entity = new WorkflowInstanceEntity();
    if (!dto) {
      return;
    }
    entity.id = dto.id;
    entity.requestorId = dto.requestorId;
    entity.bpId = dto.bpId;
    entity.serviceId = dto.serviceId;
    entity.status = dto.status;
    entity.submittedAt = new Date();
    entity.user = dto?.user;
    return entity;
  }
}
export class GotoNextStateDto {
  @ApiProperty()
  @IsNotEmpty()
  instanceId: string;
  @ApiProperty()
  @IsNotEmpty()
  action: string;
  @ApiProperty()
  @IsOptional()
  remark: string;
  @ApiProperty()
  @IsOptional()
  data: object;
  @ApiProperty()
  handlerId: string;
  @ApiProperty()
  @IsOptional()
  taskChecklist: TaskCheckListDto[];
}

export class WorkflowInstanceResponse extends UpdateWorkflowInstanceDto {
  @ApiProperty()
  businessProcess?: BusinessProcessResponse;
  @ApiProperty()
  submittedAt: Date;

  taskHandler?: TaskHandlerResponse;
  taskTrackers?: TaskTrackerResponse[];
  service: BpServiceResponse;
  isrvendor: IsrVendorsEntity;
  task: TaskResponse;
  pricing: ServicePrice;
  @ApiProperty()
  applicationNumber: string;
  @ApiProperty()
  businessArea: BusinessAreaEntity;
  profileUpdate: ProfileInfoEntity;
  upgrade: any;
  upgradePaymentReceipt: any;
  invoice: any;
  renewal: any;
  preferential: any;
  static toResponse(entity: WorkflowInstanceEntity) {
    const response = new WorkflowInstanceResponse();
    response.id = entity.id;
    response.bpId = entity.bpId;
    response.applicationNumber = entity.applicationNumber;
    response.requestorId = entity.requestorId;
    response.status = entity.status;
    //  response.pricing = entity?.price;
    response.submittedAt = entity.submittedAt;
    response.user = entity?.user;
    if (entity?.businessProcess) {
      response.businessProcess = BusinessProcessResponse.toResponse(
        entity?.businessProcess,
      );
    }
    if (entity?.businessProcess?.service) {
      response.service = BpServiceResponse.toResponse(
        entity?.businessProcess.service,
      );
    }
    if (entity?.taskHandler) {
      response.taskHandler = TaskHandlerResponse.toResponse(entity.taskHandler);
      response.task = response.taskHandler?.task;
      response.taskHandler.task = null;
    }

    if (entity?.isrVendor) {
      response.isrvendor = entity?.isrVendor;
      const bainfo = response.isrvendor.bankAccountDetails.map((item) => {
        if (item.isDefualt) {
          item.isDefualt = "Yes";
        } else {
          item.isDefualt = "No";
        }
        return item;
      });
      response.isrvendor.bankAccountDetails = [...bainfo];
      const basic: any = entity?.isrVendor.basic;
      const { level, status, ...basicRest } = basic;
      basicRest.status = entity?.isrVendor.status;
      response.isrvendor.basic = { ...basicRest };
    }

    if (entity?.taskTrackers) {
      response.taskTrackers = entity?.taskTrackers?.map((handler) =>
        TaskTrackerResponse.toResponse(handler),
      );
    }
    if (entity?.service) {
      response.service = BpServiceResponse.toResponse(entity?.service);
    }

    return response;
  }
  static formatBusinessLines(bia: any[], prices: ServicePrice[]): any[] {
    const businessInterests = [];
    if (bia?.length > 0) {
      for (const bi of bia) {
        const lobs = bi.lineOfBusiness.map((item: any) => {
          return item?.name;
        });
        let range = {};
        for (const item of prices) {
          if (bi.priceRange == item.id) {
            range = {
              priceFrom: item?.valueFrom,
              priceTo: item?.valueTo == -1 ? 'infinity' : item?.valueTo,
            };
            break;
          }
        }
        businessInterests.push({
          category: bi.category,
          ...range,
          lineOfBusiness: lobs,
        });
      }
      return businessInterests;
    }
  }
  static formatBusinessLine(bia: any): any {
    const lobs = bia.lineOfBusiness.map((item: any) => {
      return item.name;
    });
    return lobs;
  }
}
