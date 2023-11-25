import { Controller, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { DataResponseFormat } from 'src/shared/api-data';
import { TaskService } from '../services/task.service';
import { JwtGuard } from 'src/shared/authorization';
import { BusinessProcessService } from '../services/business-process.service';
import { BpServiceService } from 'src/modules/services/services/service.service';
import { BanksEntity, TaskAssignmentEntity } from 'src/entities';
import { ServicePricingService } from 'src/modules/pricing/services/service-pricing.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryService } from 'src/modules/categories/services/category.service';
@ApiBearerAuth()
@Controller('data-seeder')
@ApiTags('data-seeder')
@ApiExtraModels(DataResponseFormat)
export class DataSeederController {
  constructor(
    private readonly taskService: TaskService,
    private readonly serviceService: BpServiceService,
    private readonly pricingService: ServicePricingService,
    private readonly bpService: BusinessProcessService,
    @InjectRepository(BanksEntity)
    private readonly bankRepository: Repository<BanksEntity>,
    @InjectRepository(TaskAssignmentEntity)
    private readonly assignmentRepository: Repository<TaskAssignmentEntity>,
    private readonly categoryService: CategoryService,
  ) {}
  @UseGuards(JwtGuard)
  @Post('seed-services')
  @ApiOkResponse()
  async seedService() {
    const serviceToSeed = [
      {
        id: 'a044b8d0-d653-5dd3-fd34-1f67d19ebf03',
        name: 'Profile update',
        key: 'profileUpdate',
        isActive: true,

        tenantId: 0,
        description: null,
      },
      {
        id: 'be80a5d2-6de5-4310-bd3a-b67258535bbd',
        name: 'Local',
        key: 'local',
        isActive: true,

        tenantId: 0,
        description: null,
      },
      {
        id: '26ff8e51-0f68-9c28-2ea4-a32a5e1f184f',
        name: 'IBM',
        key: 'ibm',
        isActive: true,

        tenantId: 0,
        description: null,
      },
      {
        id: 'a63fb5b9-9896-8c73-4fd0-882d4e9a6e9a',
        name: 'MSME',
        key: 'msme',
        isActive: true,

        tenantId: 0,
        description: null,
      },
      {
        id: '1a885fbb-cde1-4349-a9cf-cddcecb59e8d',
        name: 'Debar',
        key: 'debar',
        isActive: true,

        tenantId: 0,
        description: null,
      },
      {
        id: 'f40139f8-2861-4c95-a491-08033b13daf4',
        name: 'Release(Permit)',
        key: 'release',
        isActive: true,

        tenantId: 0,
        description: null,
      },
      {
        id: '76be510e-033e-415b-9e3e-8f9795c01756',
        name: 'Services Renewal',
        key: 'ServicesRenewal',
        isActive: true,

        tenantId: 0,
        description: null,
      },
      {
        id: '7fcb88b0-86e3-4f11-950a-f24f09323d0d',
        name: 'Works Renewal',
        key: 'WorksRenewal',
        isActive: true,

        tenantId: 0,
        description: null,
      },
      {
        id: '897e5182-927b-4f1d-bd25-10fb99a13d37',
        name: 'Goods Upgrade',
        key: 'GoodsUpgrade',
        isActive: true,

        tenantId: 0,
        description: null,
      },
      {
        id: '29bbe5d9-8d44-4ffa-aa2f-4d12f4d7018b',
        name: 'Services Upgrade',
        key: 'ServicesUpgrade',
        isActive: true,

        tenantId: 0,
        description: null,
      },
      {
        id: 'cf7ef60f-01dc-4228-b203-89e5d3a3c9aa',
        name: 'Works Upgrade',
        key: 'WorksUpgrade',
        isActive: true,

        tenantId: 0,
        description: null,
      },
      {
        id: '62e96410-e869-4231-b693-f7e22d498b65',
        name: 'Goods Renewal',
        key: 'GoodsRenewal',
        isActive: true,

        tenantId: 0,
        description: null,
      },
      {
        id: 'bb6934e1-9706-1e1b-c02f-b35c3e6153a4',
        name: 'New Registration for Goods',
        key: 'GoodsNewRegistration',
        isActive: true,

        tenantId: 0,
        description: null,
      },
      {
        id: '3f78dced-838d-4757-ade0-4fd0444c142a',
        name: 'Registration Works',
        key: 'WorksNewRegistration',
        isActive: true,

        tenantId: 0,
        description: null,
      },
      {
        id: '5f764d17-a165-42ab-879d-358bc03fe5d8',
        name: 'Registration for Services',
        key: 'ServicesNewRegistration',
        isActive: true,
        tenantId: 0,
        description: null,
      },
    ];
    await this.serviceService.saveBulk(serviceToSeed);
    // await dataSource.createEntityManager().save<BpServiceEntity>(services);
  }
  @UseGuards(JwtGuard)
  @Post('seed-business-processes')
  @ApiOkResponse()
  async seedBP() {
    const bpsToSeed = [
      {
        tenantId: 0,

        id: '0f7d46b9-ffd6-4b4c-91f8-9e290d675053',
        serviceId: 'a044b8d0-d653-5dd3-fd34-1f67d19ebf03',
        workflow:
          '{"id": "Profile update Workflow", "states": {"End": {"on": {}, "meta": {"type": "end"}}, "Approval of Vendor Profile Update Request": {"on": {"Adjust": "Submission of Vendor Profile Update Request", "Reject": "End", "Approve": "Approval of Vendor Profile Update Request By Director General (Head of PDE)"}, "meta": {"type": "Approval"}}, "Submission of Vendor Profile Update Request": {"on": {"ISR": "Approval of Vendor Profile Update Request"}, "meta": {"type": {"start": true}}}, "Approval of Vendor Profile Update Request By Director General (Head of PDE)": {"on": {"NO": "Submission of Vendor Profile Update Request", "YES": "End"}}}, "initial": "Submission of Vendor Profile Update Request"}',
        version: 1,
        isActive: true,
        organizationId: null,
        organizationName: null,
      },
      {
        tenantId: 0,

        id: '96d95fdb-7852-4ddc-982f-0e94d23d15d3',
        serviceId: '5f764d17-a165-42ab-879d-358bc03fe5d8',
        workflow:
          '{"id": "Services Registration", "states": {"End": {"on": {}, "meta": {"type": "end", "apiUrl": "https://dev-bo.megp.peragosystems.com/vendors/api/business-area"}}, "Generate Vendor Registration Certificate": {"on": {"FAIL": "Generate Vendor Registration Certificate", "SUCCESS": "End"}, "meta": {"type": "Certificate"}}, "Approval of New Vendor Registration Request": {"on": {"ADJUST": "Submission of New Vendor Registration Request", "REJECT": "End", "APPROVE": "Approval of Vendor Registration Request By CRO"}, "meta": {"type": "Approval"}}, "Submission of New Vendor Registration Request": {"on": {"ISR": "Approval of New Vendor Registration Request"}, "meta": {"type": {"start": true}}}, "Approval of Vendor Registration Request By CRO": {"on": {"NO": "Approval of New Vendor Registration Request", "YES": "Final Approval of New Vendor Registration by RRM"}, "meta": {"type": "Confirmation"}}, "Final Approval of New Vendor Registration by RRM": {"on": {"NO": "Approval of Vendor Registration Request By CRO", "YES": "Generate Vendor Registration Certificate"}, "meta": {"type": "Confirmation"}}}, "initial": "Submission of New Vendor Registration Request"}',
        version: 1,
        isActive: true,
        organizationId: null,
        organizationName: null,
      },
      {
        tenantId: 0,
        id: '745c9643-1f1d-464f-860c-3087bfc1a7c1',
        serviceId: '3f78dced-838d-4757-ade0-4fd0444c142a',
        workflow:
          '{"id": "Works New Registration  Workflow", "states": {"End": {"on": {}, "meta": {"type": "end"}}, "Approval of Vendor Profile Update Request": {"on": {"Adjust": "Submission of Vendor Profile Update Request", "Reject": "End", "Approve": "Approval of Vendor Profile Update Request By Director General (Head of PDE)"}, "meta": {"type": "Approval"}}, "Submission of Vendor Profile Update Request": {"on": {"ISR": "Approval of Vendor Profile Update Request"}, "meta": {"type": {"start": true}}}, "Approval of Vendor Profile Update Request By Director General (Head of PDE)": {"on": {"NO": "Submission of Vendor Profile Update Request", "YES": "End"}}}, "initial": "Submission of Vendor Profile Update Request"}',
        version: 1,
        isActive: true,
        organizationId: null,
        organizationName: null,
      },
      {
        tenantId: 0,

        id: 'b97fb7aa-2442-4e5d-8b42-42bd6ef41138',
        serviceId: '76be510e-033e-415b-9e3e-8f9795c01756',
        workflow: '{}',
        version: 0,
        isActive: true,
        organizationId: null,
        organizationName: null,
      },
      {
        tenantId: 0,

        id: 'd822c2d4-1023-4328-a172-adfcd78a30d4',
        serviceId: 'bb6934e1-9706-1e1b-c02f-b35c3e6153a4',
        workflow:
          '{"id": "Goods Registration", "states": {"End": {"on": {}, "meta": {"type": "end", "apiUrl": "https://dev-bo.megp.peragosystems.com/vendors/api/business-area"}}, "Generate Vendor Registration Certificate": {"on": {"FAIL": "Generate Vendor Registration Certificate", "SUCCESS": "End"}, "meta": {"type": "Certificate"}}, "Approval of New Vendor Registration Request": {"on": {"ADJUST": "Submission of New Vendor Registration Request", "REJECT": "End", "APPROVE": "Approval of Vendor Registration Request By CRO"}, "meta": {"type": "Approval"}}, "Submission of New Vendor Registration Request": {"on": {"ISR": "Approval of New Vendor Registration Request"}, "meta": {"type": {"start": true}}}, "Approval of Vendor Registration Request By CRO": {"on": {"NO": "Approval of New Vendor Registration Request", "YES": "Final Approval of New Vendor Registration by RRM"}, "meta": {"type": "Confirmation"}}, "Final Approval of New Vendor Registration by RRM": {"on": {"NO": "Approval of Vendor Registration Request By CRO", "YES": "Generate Vendor Registration Certificate"}, "meta": {"type": "Confirmation"}}}, "initial": "Submission of New Vendor Registration Request"}',
        version: 0,
        isActive: true,
        organizationId: null,
        organizationName: null,
      },
      {
        tenantId: 0,

        id: '543d59c0-3b13-401f-bb78-058de7f65a11',
        serviceId: '7fcb88b0-86e3-4f11-950a-f24f09323d0d',
        workflow: '{}',
        version: 0,
        isActive: true,
        organizationId: null,
        organizationName: null,
      },
      {
        tenantId: 0,

        id: 'cd17ba61-a510-4fed-9e50-a3f10b6570d3',
        serviceId: '62e96410-e869-4231-b693-f7e22d498b65',
        workflow: '{}',
        version: 0,
        isActive: true,
        organizationId: null,
        organizationName: null,
      },
      {
        tenantId: 0,

        id: 'abe4ba2c-a260-4bbb-bc8d-f101c33b6dc1',
        serviceId: '897e5182-927b-4f1d-bd25-10fb99a13d37',
        workflow: '{}',
        version: 0,
        isActive: true,
        organizationId: null,
        organizationName: null,
      },
      {
        tenantId: 0,

        id: '11a07c2b-2b12-44bc-894e-a1aede0194c4',
        serviceId: '29bbe5d9-8d44-4ffa-aa2f-4d12f4d7018b',
        workflow: '{}',
        version: 0,
        isActive: true,
        organizationId: null,
        organizationName: null,
      },
      {
        tenantId: 0,

        id: '950e28cf-ad82-4159-8b2c-f147bbe3685f',
        serviceId: 'cf7ef60f-01dc-4228-b203-89e5d3a3c9aa',
        workflow: '{}',
        version: 0,
        isActive: true,
        organizationId: null,
        organizationName: null,
      },
      {
        tenantId: 0,

        id: 'd324da2a-d68a-44e1-866c-bf34151e91cc',
        serviceId: 'be80a5d2-6de5-4310-bd3a-b67258535bbd',
        workflow: '{}',
        version: 0,
        isActive: true,
        organizationId: null,
        organizationName: null,
      },
      {
        tenantId: 0,

        id: '329201c3-3218-4e6c-8478-39bee76a43a6',
        serviceId: '26ff8e51-0f68-9c28-2ea4-a32a5e1f184f',
        workflow: '{}',
        version: 0,
        isActive: true,
        organizationId: null,
        organizationName: null,
      },
      {
        tenantId: 0,

        id: 'c0aa3814-f987-4ff1-af44-0ceda7cc9b40',
        serviceId: 'a63fb5b9-9896-8c73-4fd0-882d4e9a6e9a',
        workflow: '{}',
        version: 0,
        isActive: true,
        organizationId: null,
        organizationName: null,
      },
      {
        tenantId: 0,

        id: '7539e439-4e3f-4f9c-9151-b21ca7a808fc',
        serviceId: '1a885fbb-cde1-4349-a9cf-cddcecb59e8d',
        workflow: '{}',
        version: 0,
        isActive: true,
        organizationId: null,
        organizationName: null,
      },
      {
        tenantId: 0,

        id: 'c9e26805-33f4-4021-9554-0578df019386',
        serviceId: 'f40139f8-2861-4c95-a491-08033b13daf4',
        workflow: '{}',
        version: 0,
        isActive: true,
        organizationId: null,
        organizationName: null,
      },
      {
        tenantId: 0,

        id: 'a5350ef3-a8ec-4f98-8a4a-b3c87765234e',
        serviceId: 'be80a5d2-6de5-4310-bd3a-b67258535bbd',
        workflow: '{}',
        version: 0,
        isActive: true,
        organizationId: null,
        organizationName: null,
      },
      {
        tenantId: 0,

        id: '51fe1c97-c1d2-4dbe-9709-6f23f29ba0ba',
        serviceId: '26ff8e51-0f68-9c28-2ea4-a32a5e1f184f',
        workflow: '{}',
        version: 0,
        isActive: true,
        organizationId: null,
        organizationName: null,
      },
      {
        tenantId: 0,
        id: '0b29c2f8-a0e4-4fa2-9a92-0ada7aa0ba49',
        serviceId: 'a63fb5b9-9896-8c73-4fd0-882d4e9a6e9a',
        workflow: '{}',
        version: 0,
        isActive: true,
        organizationId: null,
        organizationName: null,
      },
      {
        tenantId: 0,

        id: '0a353ad3-229a-4329-a697-fac97d94b30c',
        serviceId: '1a885fbb-cde1-4349-a9cf-cddcecb59e8d',
        workflow: '{}',
        version: 0,
        isActive: true,
        organizationId: null,
        organizationName: null,
      },
      {
        tenantId: 0,
        id: 'bfdd841a-9152-4c39-a9f2-25b7dc7c0c4c',
        serviceId: 'f40139f8-2861-4c95-a491-08033b13daf4',
        workflow: '{}',
        version: 0,
        isActive: true,
        organizationId: null,
        organizationName: null,
      },
    ];
    await this.bpService.saveBulk(bpsToSeed);
  }
  @UseGuards(JwtGuard)
  @Post('seed-task-types')
  @ApiOkResponse()
  async seedTaskTypes() {
    const taskAssignments = [];
    for (const assign of taskAssignments) {
      let entity = new TaskAssignmentEntity();
      entity = { ...assign };
      await this.assignmentRepository.save(entity);
    }
  }
  @UseGuards(JwtGuard)
  @Post('seed-tasks')
  @ApiOkResponse()
  async seedTask() {
    const tasksToSeed = [
      {
        id: '96752a13-205f-45eb-8b6f-118ebf0c89c7',
        name: 'Generate Vendor Registration Certificate',
        label: 'Generated Certeficates',
        description: 'Generate Vendor Registration Certificate',
        bpId: 'd822c2d4-1023-4328-a172-adfcd78a30d4',
        handlerType: 'Assignee',
        taskType: 'Certificate',
        checkList: null,
        orderBy: 9,
      },
      {
        id: '4459af13-b86d-4b79-b1b9-2cb2dda76386',
        name: 'Submission of New Vendor Registration Request',
        label: 'Submiited Vendor Registration Request',
        description: 'Submission of New Vendor Registration Request',
        bpId: '96d95fdb-7852-4ddc-982f-0e94d23d15d3',
        handlerType: 'Requestor',
        taskType: 'ISR',
        checkList: null,
        orderBy: 1,
      },
      {
        id: '4066d458-d4aa-483c-a466-b5483ccbd286',
        name: 'Approval of New Vendor Registration Request',
        label: ' Reviewed Vendor Registration Request',
        description: 'Approval of New Vendor Registration Request',
        bpId: 'd822c2d4-1023-4328-a172-adfcd78a30d4',
        handlerType: 'Assignee',
        taskType: 'Approval',
        checkList:
          '[{"id": "96d95fdb-7852-4ddc-982f-0e94d23d15d3", "description": "All the required information and related documents fullfilled", "isMandatory": "true"}]',
        orderBy: 3,
      },
      {
        id: '1a20640c-5e65-4325-a471-cf20aa19da4c',
        name: 'Submission of New Vendor Registration Request',
        label: 'Submiited Vendor Registration Request',
        description: 'Submission of New Vendor Registration Request',
        bpId: 'd822c2d4-1023-4328-a172-adfcd78a30d4',
        handlerType: 'Requestor',
        taskType: 'ISR',
        checkList: null,
        orderBy: 1,
      },
      {
        id: '74557983-18a8-4291-9e76-7d6b46cfad4c',
        name: 'Approval of Vendor Profile Update Request',
        label: 'Reviewed Vendor Profile Update Request',
        description: 'Vendor Profile Update Request Review',
        bpId: '0f7d46b9-ffd6-4b4c-91f8-9e290d675053',
        handlerType: 'Assignee',
        taskType: 'Confirmation',
        checkList:
          '[{"id": "96d95fdb-7852-4ddc-982f-0e94d23d15d3", "description": "The paid amount is equal to the invoive", "isMandatory": "true"}, {"id": "96d95fdb-7852-4ddc-982f-0e94d23d15d4", "description": "The reciept is valid", "isMandatory": "true"}]',
        orderBy: 1,
      },
      {
        id: 'd8f268ac-f85f-4973-94c3-134f753cd25e',
        name: 'Approval of Vendor Registration Request By CRO',
        label: 'Approved by  CRO',
        description: 'Approval of Vendor Registration Request By CRO',
        bpId: 'd822c2d4-1023-4328-a172-adfcd78a30d4',
        handlerType: 'Assignee',
        taskType: 'Confirmation',
        checkList:
          '[{"id": "96d95fdb-7852-4ddc-982f-0e94d23d15d3", "description": "All the required information and related documents fullfilled", "isMandatory": "true"}]',
        orderBy: 5,
      },
      {
        id: '87ebef7d-75ee-4acc-ac51-0597ffb06d8b',
        name: 'Approval of New Vendor Registration Request',
        label: 'Reviewed Vendor Registration Request',
        description: 'Approval of New Vendor Registration Request',
        bpId: '96d95fdb-7852-4ddc-982f-0e94d23d15d3',
        handlerType: 'Assignee',
        taskType: 'Approval',
        checkList:
          '[{"id": "96d95fdb-7852-4ddc-982f-0e94d23d15d3", "description": "All the required information and related documents fullfilled", "isMandatory": "true"}]',
        orderBy: 2,
      },
      {
        id: '277e4d2f-f996-4546-9320-3d5103e22c63',
        name: 'Approval of Vendor Profile Update Request By Director General (Head of PDE)',
        label: 'Vendor Profile Update Request Reviewed by Director General',
        description: 'Vendor Profile Update Request Review by Director General',
        bpId: '0f7d46b9-ffd6-4b4c-91f8-9e290d675053',
        handlerType: 'Assignee',
        taskType: 'Confirmation',
        checkList:
          '[{"id": "96d95fdb-7852-4ddc-982f-0e94d23d15d3", "description": "The paid amount is equal to the invoive", "isMandatory": "true"}, {"id": "96d95fdb-7852-4ddc-982f-0e94d23d15d4", "description": "The reciept is valid", "isMandatory": "true"}]',
        orderBy: 1,
      },
      {
        id: '17ff23e0-11d9-46fc-9357-55604cb2c4cb',
        name: 'Approval of Vendor Registration Request By CRO',
        label: 'Approved by  CRO',
        description: 'Approval of Vendor Registration Request By CRO',
        bpId: '96d95fdb-7852-4ddc-982f-0e94d23d15d3',
        handlerType: 'Assignee',
        taskType: 'Confirmation',
        checkList:
          '[{"id": "96d95fdb-7852-4ddc-982f-0e94d23d15d3", "description": "All the required information and related documents fullfilled", "isMandatory": "true"}]',
        orderBy: 3,
      },
      {
        id: '35967d94-dcaa-4449-8b55-a70350f5e698',
        name: 'Submission of Vendor Profile Update Request',
        label: 'Requested Vendor Profile Update',
        description: 'Vendor Profile Update Request',
        bpId: '0f7d46b9-ffd6-4b4c-91f8-9e290d675053',
        handlerType: 'Requestor',
        taskType: 'ISR',
        checkList:
          '[{"id": "96d95fdb-7852-4ddc-982f-0e94d23d15d3", "description": "The paid amount is equal to the invoive", "isMandatory": "true"}, {"id": "96d95fdb-7852-4ddc-982f-0e94d23d15d4", "description": "The reciept is valid", "isMandatory": "true"}]',
        orderBy: 1,
      },
      {
        id: '6428a5a6-1d66-45fe-b0c0-1f34aecb676c',
        name: 'Final Approval of New Vendor Registration by RRM',
        label: 'Approved by RRM ',
        description: 'Final Approval of New Vendor Registration by RRM',
        bpId: '96d95fdb-7852-4ddc-982f-0e94d23d15d3',
        handlerType: 'Assignee',
        taskType: 'Confirmation',
        checkList:
          '[{"id": "96d95fdb-7852-4ddc-982f-0e94d23d15d3", "description": "All the required information and related documents fullfilled", "isMandatory": "true"}]',
        orderBy: 4,
      },
      {
        id: '062b9571-b2cf-44c8-a8ad-bd79fdecc2fe',
        name: 'Generate Vendor Registration Certificate',
        label: 'Generated Certeficates',
        description: 'Generate Vendor Registration Certificate',
        bpId: '96d95fdb-7852-4ddc-982f-0e94d23d15d3',
        handlerType: 'Assignee',
        taskType: 'Certificate',
        checkList: null,
        orderBy: 5,
      },
      {
        id: '31fac537-e71b-479b-9c4a-7f344720598f',
        name: 'Final Approval of New Vendor Registration by RRM',
        label: 'Approved by RRM ',
        description: 'Final Approval of New Vendor Registration by RRM',
        bpId: 'd822c2d4-1023-4328-a172-adfcd78a30d4',
        handlerType: 'Assignee',
        taskType: 'Confirmation',
        checkList:
          '[{"id": "96d95fdb-7852-4ddc-982f-0e94d23d15d3", "description": "All the required information and related documents fullfilled", "isMandatory": "true"}]',
        orderBy: 7,
      },
    ];
    await this.taskService.saveBulk(tasksToSeed);
  }
  @UseGuards(JwtGuard)
  @Post('seed-pricing')
  @ApiOkResponse()
  async seedPricing() {
    const pricesToSeed = [
      {
        id: '47ec877c-d340-4d89-81f3-3d7d29e968d4',
        serviceId: 'bb6934e1-9706-1e1b-c02f-b35c3e6153a4',
        businessArea: 'Goods',
        valueFrom: 1,
        valueTo: 10000000,
        fee: 10000,
        currency: 'MK',

        tenantId: 0,
      },
      {
        id: 'aa4da85e-39fb-42c1-8808-2a06767f3ae9',
        serviceId: 'bb6934e1-9706-1e1b-c02f-b35c3e6153a4',
        businessArea: 'Goods',
        valueFrom: 10000000,
        valueTo: 30000000,
        fee: 20000,
        currency: 'MK',

        tenantId: 0,
      },
      {
        id: 'a8534c9e-2dc2-4116-a174-d90e8d1023f4',
        serviceId: 'bb6934e1-9706-1e1b-c02f-b35c3e6153a4',
        businessArea: 'Goods',
        valueFrom: 30000000,
        valueTo: 80000000,
        fee: 30000,
        currency: 'MK',

        tenantId: 0,
      },
      {
        id: '2a9b4cde-4184-485d-9452-e433379f6d89',
        serviceId: 'bb6934e1-9706-1e1b-c02f-b35c3e6153a4',
        businessArea: 'Goods',
        valueFrom: 80000000,
        valueTo: 100000000,
        fee: 60000,
        currency: 'MK',

        tenantId: 0,
      },
      {
        id: '8723cd80-873d-48c7-95ad-394b16af133d',
        serviceId: 'bb6934e1-9706-1e1b-c02f-b35c3e6153a4',
        businessArea: 'Goods',
        valueFrom: 100000000,
        valueTo: 500000000,
        fee: 100000,
        currency: 'MK',

        tenantId: 0,
      },
      {
        id: '892e1379-a66f-4c0b-8382-5b248840cae7',
        serviceId: 'bb6934e1-9706-1e1b-c02f-b35c3e6153a4',
        businessArea: 'Goods',
        valueFrom: 1000000000,
        valueTo: -1,
        fee: 500000,
        currency: 'MK',

        tenantId: 0,
      },
      {
        id: 'fad2c120-4d02-4ce6-975a-91b5c0ed829c',
        serviceId: 'a63fb5b9-9896-8c73-4fd0-882d4e9a6e9a',
        businessArea: 'Goods',
        valueFrom: 100,
        valueTo: 100000,
        fee: 1,
        currency: 'MK',

        tenantId: 0,
      },
      {
        id: '81380591-c320-4ed2-a5a0-82b1e4714dd1',
        serviceId: 'f40139f8-2861-4c95-a491-08033b13daf4',
        businessArea: 'Service',
        valueFrom: 20000,
        valueTo: 56666,
        fee: 1000,
        currency: 'MK',

        tenantId: 0,
      },
      {
        id: '1042cb02-0dbf-43b7-a552-6d56cf9fb99a',
        serviceId: 'bb6934e1-9706-1e1b-c02f-b35c3e6153a4',
        businessArea: 'Work',
        valueFrom: 12,
        valueTo: 12,
        fee: 12,
        currency: 'MK',

        tenantId: 0,
      },
      {
        id: '71a9bc4b-3291-4ae7-986c-0bbf704c4336',
        serviceId: '62e96410-e869-4231-b693-f7e22d498b65',
        businessArea: 'Goods',
        valueFrom: 1,
        valueTo: 1000000,
        fee: 4000,
        currency: 'MK',

        tenantId: 0,
      },
      {
        id: 'e29650a8-889a-4009-9a43-a2e8e5da8cb2',
        serviceId: '62e96410-e869-4231-b693-f7e22d498b65',
        businessArea: 'Goods',
        valueFrom: 500000000,
        valueTo: 1000000000,
        fee: 200000,
        currency: 'MK',

        tenantId: 0,
      },
      {
        id: '099bd8ca-1db1-4555-952d-05681acf8746',
        serviceId: '5f764d17-a165-42ab-879d-358bc03fe5d8',
        businessArea: 'Services',
        valueFrom: 1,
        valueTo: 10000000,
        fee: 10000,
        currency: 'MK',

        tenantId: 0,
      },
      {
        id: 'be612ffa-7ab0-433d-beeb-cc52ce198e24',
        serviceId: '5f764d17-a165-42ab-879d-358bc03fe5d8',
        businessArea: 'Services',
        valueFrom: 10000000,
        valueTo: 30000000,
        fee: 20000,
        currency: 'MK',

        tenantId: 0,
      },
      {
        id: '79d4a0e2-ddbd-451a-91b1-1244751b1377',
        serviceId: '5f764d17-a165-42ab-879d-358bc03fe5d8',
        businessArea: 'Services',
        valueFrom: 30000000,
        valueTo: 80000000,
        fee: 30000,
        currency: 'MK',

        tenantId: 0,
      },
      {
        id: '267c5cb2-5df1-4783-97fa-e3205c5da6be',
        serviceId: '5f764d17-a165-42ab-879d-358bc03fe5d8',
        businessArea: 'Services',
        valueFrom: 80000000,
        valueTo: 100000000,
        fee: 60000,
        currency: 'MK',

        tenantId: 0,
      },
      {
        id: 'bd7a5794-e950-448f-8590-54dfd869bdf5',
        serviceId: '5f764d17-a165-42ab-879d-358bc03fe5d8',
        businessArea: 'Services',
        valueFrom: 100000000,
        valueTo: 500000000,
        fee: 100000,
        currency: 'MK',

        tenantId: 0,
      },
      {
        id: '107fcd4f-6c54-4889-972f-cc029eedeeda',
        serviceId: '5f764d17-a165-42ab-879d-358bc03fe5d8',
        businessArea: 'Services',
        valueFrom: 500000000,
        valueTo: 1000000000,
        fee: 200000,
        currency: 'MK',

        tenantId: 0,
      },
      {
        id: 'b3e6b1f3-7d5c-40d2-8fe9-618bf656e656',
        serviceId: '5f764d17-a165-42ab-879d-358bc03fe5d8',
        businessArea: 'Services',
        valueFrom: 1000000000,
        valueTo: -1,
        fee: 100000000500000,
        currency: 'MK',
        tenantId: 0,
      },
    ];

    await this.pricingService.saveBulk(pricesToSeed);
  }

  @UseGuards(JwtGuard)
  @Post('seed-banks')
  @ApiOkResponse()
  async seedBanks() {
    const banksToSeed: any = [
      {
        id: '008ae6c2-b041-46b9-a3ad-cba6bb1e7814',
        bankName: 'CDH Investment Bank',
        metaData: '{}',
      },

      {
        id: '56e1a7b0-622d-4bf0-9a95-8ce22cfa3d2b',
        bankName: 'Ecobank Malawi',
        metaData: '{}',
      },
      {
        id: '253ebb4c-8977-4f91-9d34-d67ba0049a32',
        bankName: 'FDH Bank',
        metaData: '{}',
      },
      {
        id: '59dab6cf-7467-4c1a-b9db-6dec0c397426',
        bankName: 'First Capital Bank Malawi Limited',
        metaData: '{}',
      },
      {
        id: '2599fbba-de6d-4b2a-b01f-84dbe164cbe8',
        bankName: 'National Bank of Malawi',
        metaData: '{}',
      },
      {
        id: '775ccf39-5c89-454a-9879-8b8fcdad292c',
        bankName: 'NBS Bank',
        metaData: '{}',
      },
      {
        id: '6664bc2b-1e3a-4f6f-825e-f6fc4bfc0fd9',
        bankName: "'Standard Bank Malawi",
        metaData: '{}',
      },
      {
        id: 'f3beddcb-b5fd-e5fb-c594-614f06e7e3f5',
        bankName: 'Centenary Bank Malawi.',
        metaData: '{}',
      },
    ];
    await this.bankRepository.save(banksToSeed);
  }
  @UseGuards(JwtGuard)
  @Post('seed-categories')
  @ApiOkResponse()
  async seedCategories() {
    const categoriesToSeed = [
      {
        id: '148c3b66-e213-9d98-923a-2bec4dffeb2b',
        code: 'M1mS4PWnMH',
        description: 'Telecommunications equipment',
        businessArea: 'Goods',
        parentId: null,
      },
      {
        id: '10a9f8a0-8974-43d1-af3d-608afbeb5527',
        code: 'code345',
        description: 'Textile products',
        businessArea: 'Goods',
        parentId: null,
      },
      {
        id: '8c515b13-717a-7bc7-59e4-28d9543589b0',
        code: 'MDOALotzNS',
        description: 'Maintenance of motor vehicles',
        businessArea: 'Services',
        parentId: null,
      },
      {
        id: '4d76fe11-9380-1366-05fd-c57a237fc69f',
        code: 'RRxYCFAW9G',
        description:
          'Maintenance of office equipment, refrigeration & air-conditioning',
        businessArea: 'Services',
        parentId: null,
      },
      {
        id: 'bde6f70e-eb14-b39c-6ffd-d47cee121fa1',
        code: 'ye4r4qsh3g',
        description: 'Cleaning services',
        businessArea: 'Services',
        parentId: null,
      },
      {
        id: 'f5263ce0-4e4a-b03a-3735-244d03603431',
        code: '7bXENqBI69',
        description: 'Plumbing services',
        businessArea: 'Services',
        parentId: null,
      },
      {
        id: 'a06c9bd6-95bb-c09d-e58b-fbc4fbb65b47',
        code: 'MdqmfTM1I7',
        description: 'Transport services',
        businessArea: 'Services',
        parentId: null,
      },
      {
        id: '641a3198-42ab-f65a-a8df-7005f7f4cb46',
        code: 'XxifXn9w1Y',
        description: 'Office equipment',
        businessArea: 'Goods',
        parentId: null,
      },
      {
        id: 'dc73ed01-d1fa-3f83-13db-f26f38d8c911',
        code: 'F71e820X5K',
        description: 'Farm implements',
        businessArea: 'Goods',
        parentId: null,
      },
      {
        id: 'fcb3f99f-97fe-ea08-6ab4-4475b0b43146',
        code: 'wCNOtacASu',
        description: 'Travel agency',
        businessArea: 'Services',
        parentId: null,
      },
      {
        id: 'dc049688-1838-7c78-4b2c-0e9f08b9b3ff',
        code: 'qDYCtRlbYi',
        description:
          'Plant and motor vehicle spares\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n',
        businessArea: 'Goods',
        parentId: null,
      },
      {
        id: 'e7474b6e-7dcf-95d1-db49-65a9438ff278',
        code: 'nHlu5ttz1P',
        description: 'Laboratory & hospital equipment',
        businessArea: 'Goods',
        parentId: null,
      },
      {
        id: 'e40661a4-3973-8caf-b36d-48518b8794e1',
        code: 'RPxvswbUbc',
        description: 'Tools and hardware',
        businessArea: 'Goods',
        parentId: null,
      },
      {
        id: 'f7d4125d-b875-5dcb-81ab-0726b44a54ea',
        code: 'bvcN2nqoWW',
        description: '. Office consumables',
        businessArea: 'Goods',
        parentId: null,
      },
      {
        id: 'dff36da2-5fe7-1ce8-23a3-879a41c3e0c8',
        code: 'hz4MuwBRA8',
        description: 'Plumbing materials',
        businessArea: 'Goods',
        parentId: null,
      },
      {
        id: '3efe9c57-0a67-964c-9255-112f3b1a64c3',
        code: 'BgBWpq2RYC',
        description: 'Consultancy',
        businessArea: 'Services',
        parentId: null,
      },
      {
        id: '393c57f0-9356-a2a2-307d-013968517df8',
        code: 'z0MbgrUmWu',
        description: 'Provision of security services',
        businessArea: 'Services',
        parentId: null,
      },
      {
        id: 'abed4f3c-a0d4-ed2b-d8ec-7148b7c8d7f6',
        code: 'W7khtXVV25',
        description: 'Servicing of firefighting equipment',
        businessArea: 'Services',
        parentId: null,
      },
    ];
    await this.categoryService.saveBulk(categoriesToSeed);
  }
  @UseGuards(JwtGuard)
  @Post('seed-task-assignment')
  @ApiOkResponse()
  async seedTaskAssignment() {
    const taskAssignments = [];
    await this.assignmentRepository.save(taskAssignments);
  }
}
