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
  ) { }
  @UseGuards(JwtGuard)
  @Post('seed-services')
  @ApiOkResponse()
  async seedService() {
    const serviceToSeed = [
      {
        id: 'a044b8d0-d653-5dd3-fd34-1f67d19ebf03',
        name: 'Profile update',
        key: 'ProfileUpdate',
        isActive: true,
        tenantId: 0,
        description: null,
      },

      {
        id: '26ff8e51-0f68-9c28-2ea4-a32a5e1f184f',
        name: 'IBM',
        key: 'IBM',
        isActive: true,
        tenantId: 0,
        description: null,
      },
      //MSM registration services
      {
        id: 'a63fb5b1-9896-8c73-4fd0-882d4e9a6e9a',
        name: 'Medium Enterprise',
        key: 'Medium',
        isActive: true,
        tenantId: 0,
        description: null,
      },
      {
        id: 'a63fb5b2-9896-8c73-4fd0-882d4e9a6e4a',
        name: 'Small Enterprise',
        key: 'Small',
        isActive: true,
        tenantId: 0,
        description: null,
      },
      {
        id: 'a54fb5b9-9896-8c73-4fd0-882d4e9a6e9a',
        name: 'Micro Enterprise',
        key: 'Micro',
        isActive: true,
        tenantId: 0,
        description: null,
      },
      {
        id: 'a16fb5b9-9896-8c73-4fd0-882d4e9a6e9a',
        name: 'Marginalized  Group',
        key: 'Marginalized_Group',
        isActive: true,
        tenantId: 0,
        description: null,
      },

      ////end of msme
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
      ///Renewal service for Goods, Works and  Services
      {
        id: '34be510e-033e-415b-9e3e-8f9795c01765',
        name: 'Registration Renewal',
        key: 'RegistrationRenewal',
        isActive: true,
        tenantId: 0,
        description: "Renew Registration of Works , Goods and Services",
      },
      ///Upgrade service for Goods, Works and  Services
      {
        id: '22be510e-033e-415b-9e3e-8f9795c01711',
        name: 'Registration Upgrade',
        key: 'RegistrationUpgrade',
        isActive: true,
        tenantId: 0,
        description: "Upgrade Registration of Works , Goods and Services",
      },


      {
        id: '7fcb88b0-86e3-4f11-950a-f24f09323d0d',
        name: 'Renewal of Registration for Works',
        key: 'WorksRenewal',
        isActive: true,

        tenantId: 0,
        description: null,
      },
      {
        id: '897e5182-927b-4f1d-bd25-10fb99a13d37',
        name: 'Upgrade Registration for Goods',
        key: 'GoodsUpgrade',
        isActive: true,

        tenantId: 0,
        description: null,
      },
      {
        id: '29bbe5d9-8d44-4ffa-aa2f-4d12f4d7018b',
        name: 'Upgrade Registration for Services',
        key: 'ServicesUpgrade',
        isActive: true,

        tenantId: 0,
        description: null,
      },
      {
        id: 'cf7ef60f-01dc-4228-b203-89e5d3a3c9aa',
        name: 'Upgrade Registration for Works',
        key: 'WorksUpgrade',
        isActive: true,

        tenantId: 0,
        description: null,
      },
      {
        id: '62e96410-e869-4231-b693-f7e22d498b65',
        name: 'Renewal Registration for Goods',
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
        name: 'New Registration for  Works',
        key: 'WorksNewRegistration',
        isActive: true,
        tenantId: 0,
        description: null,
      },
      {
        id: '5f764d17-a165-42ab-879d-358bc03fe5d8',
        name: 'New Registration for Services',
        key: 'ServicesNewRegistration',
        isActive: true,
        tenantId: 0,
        description: null,
      },
      {
        id: 'cc6934e1-9706-1e1b-c03f-b35c3e6153a1',
        name: 'New Registration',
        key: 'NewRegistration',
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
      //new registration  WF
      {
        tenantId: 0,
        id: 'c811c2d4-1023-4327-a172-adfcd78a30d5',
        serviceId: 'cc6934e1-9706-1e1b-c03f-b35c3e6153a1',
        workflow: {
          id: 'New Registration',
          states: {
            End: {
              on: {},
              meta: {
                type: 'end',
                apiUrl: '',
              },
            },
            'Submit New Vendor Registration Request': {
              on: {
                ISR: 'Review New Vendor Registration Request by Registration Officer',
              },
              meta: {
                type: {
                  start: true,
                },
              },
            },

            'Review New Vendor Registration Request by Registration Officer': {
              on: {
                ADJUST: 'Submit New Vendor Registration Request',
                CANCEL: 'End',
                APPROVE:
                  'Approval of New Vendor Registration Request by Senior or chief registration officer or RRM/DRRM',
              },
              meta: {
                type: 'InitialReview',
              },
            },
            'Approval of New Vendor Registration Request by Senior or chief registration officer or RRM/DRRM':
            {
              on: {
                NO: 'Submit New Vendor Registration Request',
                YES: 'Approval of New Vendor Registration Request by Director General (DG)',
              },
              meta: {
                type: 'Confirmation',
              },
            },
            'Approval of New Vendor Registration Request by Director General (DG)':
            {
              on: {
                ADJUST: 'Submit New Vendor Registration Request',
                APPROVE: 'Generate Vendor Registration Certificate',
                REJECT: 'End',
              },
              meta: {
                type: 'Confirmation',
              },
            },
            'Generate Vendor Registration Certificate': {
              on: {
                FAIL: 'Generate Vendor Registration Certificate',
                SUCCESS: 'End',
              },
              meta: {
                type: 'Certificate',
              },
            },
          },
          initial: 'Submit New Vendor Registration Request',
        },
        version: 0,
        isActive: true,
        organizationId: null,
        organizationName: null,
      },

      {
        tenantId: 0,
        id: 'd822c2d4-1023-4328-a172-adfcd78a30d4',
        serviceId: 'bb6934e1-9706-1e1b-c02f-b35c3e6153a4',
        workflow: {
          id: 'Goods Registration',
          states: {
            End: {
              on: {},
              meta: {
                type: 'end',
                apiUrl: '',
              },
            },
            'Submit New Vendor Registration Request for Goods': {
              on: {
                ISR: 'Review New Vendor Registration Request by Registration Officer',
              },
              meta: {
                type: {
                  start: true,
                },
              },
            },

            'Review New Vendor Registration Request by Registration Officer': {
              on: {
                ADJUST: 'Submit New Vendor Registration Request for Goods',
                CANCEL: 'End',
                APPROVE:
                  'Approval of New Vendor Registration Request by Senior or chief registration officer or RRM/DRRM',
              },
              meta: {
                type: 'InitialReview',
              },
            },
            'Approval of New Vendor Registration Request by Senior or chief registration officer or RRM/DRRM':
            {
              on: {
                NO: 'Review New Vendor Registration Request by Registration Officer',
                YES: 'Approval of New Vendor Registration Request by Director General (DG)',
              },
              meta: {
                type: 'Confirmation',
              },
            },
            'Approval of New Vendor Registration Request by Director General (DG)':
            {
              on: {
                ADJUST: 'Submit New Vendor Registration Request for Goods',
                APPROVE: 'Generate New Vendor Registration Certificate',
                REJECT: 'End',
              },
              meta: {
                type: 'Confirmation',
              },
            },
            'Generate New Vendor Registration Certificate': {
              on: {
                FAIL: 'Generate New Vendor Registration Certificate',
                SUCCESS: 'End',
              },
              meta: {
                type: 'Certificate',
              },
            },
          },
          initial: 'Submit New Vendor Registration Request for Goods',
        },
        version: 0,
        isActive: true,
        organizationId: null,
        organizationName: null,
      },
      {
        tenantId: 0,
        id: '96d95fdb-7852-4ddc-982f-0e94d23d15d3',
        serviceId: '5f764d17-a165-42ab-879d-358bc03fe5d8',
        workflow: {
          id: 'Services Registration',
          states: {
            End: {
              on: {},
              meta: {
                type: 'end',
                apiUrl: '',
              },
            },
            'Submit New Vendor Registration Request for Services': {
              on: {
                ISR: 'Review New Vendor Registration Request by Registration Officer',
              },
              meta: {
                type: {
                  start: true,
                },
              },
            },
            'Review New Vendor Registration Request by Registration Officer': {
              on: {
                ADJUST: 'Submit New Vendor Registration Request for Services',
                CANCEL: 'End',
                APPROVE:
                  'Approval of New Vendor Registration Request by Senior or chief registration officer or RRM/DRRM',
              },
              meta: {
                type: 'InitialReview',
              },
            },

            'Approval of New Vendor Registration Request by Senior or chief registration officer or RRM/DRRM':
            {
              on: {
                NO: 'Review New Vendor Registration Request by Registration Officer',
                YES: 'Approval of New Vendor Registration Request by Director General (DG)',
              },
              meta: {
                type: 'Confirmation',
              },
            },
            'Approval of New Vendor Registration Request by Director General (DG)':
            {
              on: {
                APPROVE: 'Generate New Vendor Registration Certificate',
                ADJUST: 'Submit New Vendor Registration Request for Services',
                REJECT: 'End',
              },
              meta: {
                type: 'Confirmation',
              },
            },
            'Generate New Vendor Registration Certificate': {
              on: {
                FAIL: 'Generate New Vendor Registration Certificate',
                SUCCESS: 'End',
              },
              meta: {
                type: 'Certificate',
              },
            },
          },
          initial: 'Submit New Vendor Registration Request for Services',
        },
        version: 1,
        isActive: true,
        organizationId: null,
        organizationName: null,
      },
      {
        tenantId: 0,
        id: '745c9643-1f1d-464f-860c-3087bfc1a7c1',
        serviceId: '3f78dced-838d-4757-ade0-4fd0444c142a',
        workflow: {
          id: 'Works Registration',
          states: {
            End: {
              on: {},
              meta: {
                type: 'end',
              },
            },
            'Submit New Vendor Registration Request for Works': {
              on: {
                ISR: 'Review New Vendor Registration Request by Registration Officer',
              },
              meta: {
                type: {
                  start: true,
                },
              },
            },
            'Review New Vendor Registration Request by Registration Officer': {
              on: {
                ADJUST: 'Submit New Vendor Registration Request for Works',
                CANCEL: 'End',
                APPROVE:
                  'Approval of New Vendor Registration Request by Senior or chief registration officer or RRM/DRRM',
              },
              meta: {
                type: 'InitialReview',
              },
            },

            'Approval of New Vendor Registration Request by Senior or chief registration officer or RRM/DRRM':
            {
              on: {
                NO: 'Review New Vendor Registration Request by Registration Officer',
                YES: 'Approval of New Vendor Registration Request by Director General (DG)',
              },
              meta: {
                type: 'Confirmation',
              },
            },
            'Approval of New Vendor Registration Request by Director General (DG)':
            {
              on: {
                APPROVE: 'Generate Vendor Registration Certificate',
                ADJUST: 'Submit New Vendor Registration Request for Works',
                REJECT: 'End',
              },
              meta: {
                type: 'Approval',
              },
            },
            'Generate Vendor Registration Certificate': {
              on: {
                FAIL: 'Generate Vendor Registration Certificate',
                SUCCESS: 'End',
              },
              meta: {
                type: 'Certificate',
              },
            },
          },
          initial: 'Submit New Vendor Registration Request for Works',
        },
        version: 1,
        isActive: true,
        organizationId: null,
        organizationName: null,
      },

      ///renewal WF  Goods, services, and works
      {
        tenantId: 0,
        id: 'cd17ba61-a510-4fed-9e50-a3f10b6520d3',
        serviceId: '34be510e-033e-415b-9e3e-8f9795c01765',
        workflow: {
          id: 'Renewal of Goods, services, and works',
          states: {
            End: {
              on: {},
              meta: {
                type: 'end',
                apiUrl: '',
              },
            },
            'Submit Renewal Registration Request': {
              on: {
                ISR: 'Review Vendor Renewal Registration Request by Registration Officer(RO)',
              },
              meta: {
                type: {
                  start: true,
                },
              },
            },
            'Review Vendor Renewal Registration Request by Registration Officer(RO)':
            {
              on: {
                ADJUST: 'Submit Renewal Registration Request',
                CANCEL: 'End',
                APPROVE:
                  'Approval of Renewal Registration Request by Senior or chief registration officer or RRM/DRRM',
              },
              meta: {
                type: 'InitialReview',
              },
            },
            'Approval of Renewal Registration Request by Senior or chief registration officer or RRM/DRRM':
            {
              on: {
                NO: 'Review Vendor Renewal Registration Request by Registration Officer(RO)',
                YES: 'Approval of Renewal Registration Request of vendor by Director General (DG)',
              },
              meta: {
                type: 'Confirmation',
              },
            },
            'Approval of Renewal Registration Request of vendor by Director General (DG)':
            {
              on: {
                APPROVE: 'Generate Vendor Registration Certificate',
                ADJUST: 'Submit Renewal Registration Request',
                REJECT: 'End',
              },
              meta: {
                type: 'Confirmation',
              },
            },
            'Generate Vendor Registration Certificate': {
              on: {
                FAIL: 'Generate Vendor Registration Certificate',
                SUCCESS: 'End',
              },
              meta: {
                type: 'Certificate',
              },
            },
          },
          initial: 'Submit Renewal Registration Request',
        },
        version: 0,
        isActive: true,
        organizationId: null,
        organizationName: null,
      },

      //new service workflow end
      {
        tenantId: 0,
        id: 'b97fb7aa-2442-4e5d-8b42-42bd6ef41138',
        serviceId: '76be510e-033e-415b-9e3e-8f9795c01756',
        workflow: {
          id: 'Renwal Services',
          states: {
            End: {
              on: {},
              meta: {
                type: 'end',
                apiUrl: '',
              },
            },
            'Submit Renewal Registration Request for Services': {
              on: {
                ISR: 'Review Vendor Renewal Registration Request by Registration Officer(RO)',
              },
              meta: {
                type: {
                  start: true,
                },
              },
            },
            'Review Vendor Renewal Registration Request by Registration Officer(RO)':
            {
              on: {
                ADJUST: 'Submit Renewal Registration Request for Services',
                CANCEL: 'End',
                APPROVE:
                  'Approval of Renewal Registration Request by Senior or chief registration officer or RRM/DRRM',
              },
              meta: {
                type: 'InitialReview',
              },
            },

            'Approval of Renewal Registration Request by Senior or chief registration officer or RRM/DRRM':
            {
              on: {
                NO: 'Review Vendor Renewal Registration Request by Registration Officer(RO)',
                YES: 'Approval of Renewal Registration Request of vendor by Director General (DG)',
              },
              meta: {
                type: 'Confirmation',
              },
            },
            'Approval of Renewal Registration Request of vendor by Director General (DG)':
            {
              on: {
                APPROVE: 'Generate Vendor Registration Certificate',
                ADJUST: 'Submit Renewal Registration Request for Services',
                REJECT: 'End',
              },
              meta: {
                type: 'Confirmation',
              },
            },
            'Generate Vendor Registration Certificate': {
              on: {
                FAIL: 'Generate Vendor Registration Certificate',
                SUCCESS: 'End',
              },
              meta: {
                type: 'Certificate',
              },
            },
          },
          initial: 'Submit Renewal Registration Request for Services',
        },
        version: 0,
        isActive: true,
        organizationId: null,
        organizationName: null,
      },
      {
        tenantId: 0,
        id: '543d59c0-3b13-401f-bb78-058de7f65a11',
        serviceId: '7fcb88b0-86e3-4f11-950a-f24f09323d0d',
        workflow: {
          id: 'Renewal Works',
          states: {
            End: {
              on: {},
              meta: {
                type: 'end',
              },
            },
            'Submit Renewal Registration Request for Works': {
              on: {
                ISR: 'Review Vendor Renewal Registration Request by Registration Officer(RO)',
              },
              meta: {
                type: {
                  start: true,
                },
              },
            },
            'Review Vendor Renewal Registration Request by Registration Officer(RO)':
            {
              on: {
                ADJUST: 'Submit Renewal Registration Request for Works',
                CANCEL: 'End',
                APPROVE:
                  'Approval of Renewal Registration Request by Senior or chief registration officer or RRM/DRRM',
              },
              meta: {
                type: 'InitialReview',
              },
            },

            'Approval of Renewal Registration Request by Senior or chief registration officer or RRM/DRRM':
            {
              on: {
                NO: 'Review Vendor Renewal Registration Request by Registration Officer(RO)',
                YES: 'Approval of Renewal Registration Request of vendor by Director General (DG)',
              },
              meta: {
                type: 'Confirmation',
              },
            },
            'Approval of Renewal Registration Request of vendor by Director General (DG)':
            {
              on: {
                APPROVE: 'Generate Vendor Registration Certificate',
                ADJUST: 'Submit Renewal Registration Request for Works',
                REJECT: 'End',
              },
              meta: {
                type: 'Approval',
              },
            },
            'Generate Vendor Registration Certificate': {
              on: {
                FAIL: 'Generate Vendor Registration Certificate',
                SUCCESS: 'End',
              },
              meta: {
                type: 'Certificate',
              },
            },
          },
          initial: 'Submit Renewal Registration Request for Works',
        },
        version: 0,
        isActive: true,
        organizationId: null,
        organizationName: null,
      },
      //upgrade WF Goods, Works, Services
      {
        tenantId: 0,
        id: 'abe4ba2c-a260-4bbb-bc8d-f101c33b6dc6',
        serviceId: '22be510e-033e-415b-9e3e-8f9795c01711',
        workflow: {
          id: 'Upgrade of Goods,Services, Works',
          states: {
            End: {
              on: {},
              meta: {
                type: 'end',
              },
            },
            'Submit Vendor Upgrade Registration Request': {
              on: {
                ISR: 'Review Upgrade Registration Request of Vendor by Registration Officer',
              },
              meta: {
                type: {
                  start: true,
                },
              },
            },
            'Review Upgrade Registration Request of Vendor by Registration Officer':
            {
              on: {
                ADJUST: 'Submit Vendor Upgrade Registration Request',
                CANCEL: 'End',
                APPROVE: 'Approval of Upgrade Registration Request of Vendor by Senior or chief registration officer or RRM/ DRRM',
              },
              meta: {
                type: 'InitialReview',
              },
            },
            'Approval of Upgrade Registration Request of Vendor by Senior or chief registration officer or RRM/ DRRM':
            {
              on: {
                NO: 'Review Upgrade Registration Request of Vendor by Registration Officer',
                YES: 'Approval of Upgrade Registration Request of vendor by Director General (DG)',
              },
              meta: {
                type: 'Confirmation',
              },
            },
            'Approval of Upgrade Registration Request of vendor by Director General (DG)':
            {
              on: {
                APPROVE: 'Generate Vendor Registration Certificate',
                ADJUST: 'Submit Vendor Upgrade Registration Request',
                REJECT: 'End',
              },
              meta: {
                type: 'Confirmation',
              },
            },
            'Generate Vendor Registration Certificate': {
              on: {
                FAIL: 'Generate Vendor Registration Certificate',
                SUCCESS: 'End',
              },
              meta: {
                type: 'Certificate',
              },
            },
          },
          initial: 'Submit Vendor Upgrade Registration Request',
        },
        version: 0,
        isActive: true,
        organizationId: null,
        organizationName: null,
      },
      //service upgrade
      {
        tenantId: 0,
        id: '11a07c2b-2b12-44bc-894e-a1aede0194c4',
        serviceId: '29bbe5d9-8d44-4ffa-aa2f-4d12f4d7018b',
        workflow: {
          id: 'Upgrade Service',
          states: {
            End: {
              on: {},
              meta: {
                type: 'end',
              },
            },
            'Submit Vendor Upgrade Registration Request': {
              on: {
                ISR: 'Review Upgrade Registration Request of Vendor by Registration Officer',
              },
              meta: {
                type: {
                  start: true,
                },
              },
            },
            'Review Upgrade Registration Request of Vendor by Registration Officer':
            {
              on: {
                ADJUST: 'Submit Vendor Upgrade Registration Request',
                CANCEL: 'End',
                APPROVE:
                  'Approval of Upgrade Registration Request of Vendor by Senior or chief registration officer or RRM/ DRRM',
              },
              meta: {
                type: 'InitialReview',
              },
            },
            'Approval of Upgrade Registration Request of Vendor by Senior or chief registration officer or RRM/ DRRM':
            {
              on: {
                NO: 'Review Upgrade Registration Request of Vendor by Registration Officer',
                YES: 'Approval of Upgrade Registration Request of vendor by Director General (DG)',
              },
              meta: {
                type: 'Confirmation',
              },
            },
            'Approval of Upgrade Registration Request of vendor by Director General (DG)':
            {
              on: {
                APPROVE: 'Generate Vendor Registration Certificate',
                ADJUST: 'Submit Vendor Upgrade Registration Request',
                REJECT: 'End',
              },
              meta: {
                type: 'Confirmation',
              },
            },
            'Generate Vendor Registration Certificate': {
              on: {
                FAIL: 'Generate Vendor Registration Certificate',
                SUCCESS: 'End',
              },
              meta: {
                type: 'Certificate',
              },
            },
          },
          initial: 'Submit Vendor Upgrade Registration Request',
        },
        version: 0,
        isActive: true,
        organizationId: null,
        organizationName: null,
      },
      //works upgrade
      {
        tenantId: 0,
        id: '950e28cf-ad82-4159-8b2c-f147bbe3685f',
        serviceId: 'cf7ef60f-01dc-4228-b203-89e5d3a3c9aa',
        workflow: {
          id: 'Upgrade Work',
          states: {
            End: {
              on: {},
              meta: {
                type: 'end',
              },
            },
            'Submit Vendor Upgrade Registration Request': {
              on: {
                ISR: 'Review Upgrade Registration Request of Vendor by Registration Officer',
              },
              meta: {
                type: {
                  start: true,
                },
              },
            },
            'Review Upgrade Registration Request of Vendor by Registration Officer':
            {
              on: {
                ADJUST: 'Submit Vendor Upgrade Registration Request',
                CANCEL: 'End',
                APPROVE:
                  'Approval of Upgrade Registration Request by Senior or chief registration officer or RRM/DRRM',
              },
              meta: {
                type: 'InitialReview',
              },
            },
            'Approval of Upgrade Registration Request by Senior or chief registration officer or RRM/DRRM':
            {
              on: {
                NO: 'Review Upgrade Registration Request of Vendor by Registration Officer',
                YES: 'Approval of Upgrade Registration Request of vendor by Director General (DG)',
              },
              meta: {
                type: 'Confirmation',
              },
            },
            'Approval of Upgrade Registration Request of vendor by Director General (DG)':
            {
              on: {
                APPROVE: 'End',
                ADJUST: 'Submit Vendor Upgrade Registration Request',
                REJECT: 'End',
              },
              meta: {
                type: 'Confirmation',
              },
            },
          },
          initial: 'Submit Vendor Upgrade Registration Request',
        },
        version: 0,
        isActive: true,
        organizationId: null,
        organizationName: null,
      },
      //IBM WF
      {
        tenantId: 0,
        id: '329201c3-3218-4e6c-8478-39bee76a43a6',
        serviceId: '26ff8e51-0f68-9c28-2ea4-a32a5e1f184f',
        workflow: {
          id: 'IBM Registration',
          states: {
            End: {
              on: {},
              meta: {
                type: 'end',
              },
            },
            'Submission of indigenous black Malawian(IBM) Registration Request':
            {
              on: {
                ISR: 'Approval of indigenous black Malawian(IBM) Registration Request',
              },
              meta: {
                type: {
                  start: true,
                },
              },
            },
            'Approval of indigenous black Malawian(IBM) Registration Request': {
              on: {
                ADJUST:
                  'Submission of indigenous black Malawian(IBM) Registration Request',
                REJECT: 'End',
                APPROVE: 'End',
              },
              meta: {
                type: 'Approval',
              },
            },
          },
          initial:
            'Submission of indigenous black Malawian(IBM) Registration Request',
        },
        version: 0,
        isActive: true,
        organizationId: null,
        organizationName: null,
      },
      //MSME
      {
        tenantId: 0,
        id: 'c0aa3814-f987-4ff1-af44-0ceda7cc9b40',
        serviceId: 'a63fb5b1-9896-8c73-4fd0-882d4e9a6e9a',
        workflow: {
          id: 'medium Enterprise WF',
          states: {
            End: {
              on: {},
              meta: {
                type: 'end',
              },
            },
            'Submission of Medium Enterprise Registration Request': {
              on: {
                ISR: 'Approval of Medium Enterprises Registration Request',
              },
              meta: {
                type: {
                  start: true,
                },
              },
            },
            'Approval of Medium Enterprises Registration Request': {
              on: {
                ADJUST: 'Submission of Medium Enterprise Registration Request',
                REJECT: 'End',
                APPROVE: 'End',
              },
              meta: {
                type: 'Approval',
              },
            },
          },
          initial: 'Submission of Medium Enterprise Registration Request',
        },
        version: 0,
        isActive: true,
        organizationId: null,
        organizationName: null,
      },
      {
        tenantId: 0,
        id: 'c0aa3814-f987-4ff1-af44-0ceda7cc9b51',
        serviceId: 'a63fb5b2-9896-8c73-4fd0-882d4e9a6e4a',
        workflow: {
          id: 'Small Enterprise WF',
          states: {
            End: {
              on: {},
              meta: {
                type: 'end',
              },
            },
            'Submission of Small Enterprises(SE) Registration Request': {
              on: {
                ISR: 'Approval of Small Enterprise Registration Request',
              },
              meta: {
                type: {
                  start: true,
                },
              },
            },
            'Approval of Small Enterprise Registration Request': {
              on: {
                ADJUST:
                  'Submission of Small Enterprises(SE) Registration Request',
                REJECT: 'End',
                APPROVE: 'End',
              },
              meta: {
                type: 'Approval',
              },
            },
          },
          initial: 'Submission of Small Enterprises(SE) Registration Request',
        },
        version: 0,
        isActive: true,
        organizationId: null,
        organizationName: null,
      },
      {
        tenantId: 0,
        id: 'c0aa3814-f987-4ff1-af44-0ceda7cc9b52',
        serviceId: 'a54fb5b9-9896-8c73-4fd0-882d4e9a6e9a',
        workflow: {
          id: 'Micro Enterprise WF',
          states: {
            End: {
              on: {},
              meta: {
                type: 'end',
              },
            },
            'Submission of Micro Enterprises(ME) Registration Request': {
              on: {
                ISR: 'Approval of Micro Enterprise Registration Request',
              },
              meta: {
                type: {
                  start: true,
                },
              },
            },
            'Approval of Micro Enterprise Registration Request': {
              on: {
                ADJUST:
                  'Submission of Micro Enterprises(ME) Registration Request',
                REJECT: 'End',
                APPROVE: 'End',
              },
              meta: {
                type: 'Approval',
              },
            },
          },
          initial: 'Submission of Micro Enterprises(ME) Registration Request',
        },
        version: 0,
        isActive: true,
        organizationId: null,
        organizationName: null,
      },
      {
        tenantId: 0,
        id: 'c0aa3814-f987-4ff1-af44-0ceda7cc9b53',
        serviceId: 'a16fb5b9-9896-8c73-4fd0-882d4e9a6e9a',
        workflow: {
          id: 'marginalized Group WF',
          states: {
            End: {
              on: {},
              meta: {
                type: 'end',
              },
            },
            'Submission of Marginalized Group Registration Request': {
              on: {
                ISR: 'Approval of Marginalized Group Registration Request',
              },
              meta: {
                type: {
                  start: true,
                },
              },
            },
            'Approval of Marginalized Group Registration Request': {
              on: {
                ADJUST: 'Submission of Marginalized Group Registration Request',
                REJECT: 'End',
                APPROVE: 'End',
              },
              meta: {
                type: 'Approval',
              },
            },
          },
          initial: 'Submission of Marginalized Group Registration Request',
        },
        version: 0,
        isActive: true,
        organizationId: null,
        organizationName: null,
      },
      //profile update
      {
        tenantId: 0,

        id: '0f7d46b9-ffd6-4b4c-91f8-9e290d675053',
        serviceId: 'a044b8d0-d653-5dd3-fd34-1f67d19ebf03',
        workflow: {
          id: 'Profile update Workflow',
          states: {
            End: {
              on: {},
              meta: {
                type: 'end',
              },
            },
            'Submission of Vendor Profile Update Request': {
              on: {
                ISR: 'Approval of Vendor Profile Update Request',
              },
              meta: {
                type: {
                  start: true,
                },
              },
            },
            'Approval of Vendor Profile Update Request': {
              on: {
                ADJUST: 'Submission of Vendor Profile Update Request',
                CANCEL: 'End',
                APPROVE:
                  'Approval of Vendor Profile Update Request By Director General (Head of PDE)',
              },
              meta: {
                type: 'Approval',
              },
            },
            'Approval of Vendor Profile Update Request By Director General (Head of PDE)':
            {
              on: {
                ADJUST: 'Submission of Vendor Profile Update Request',
                APPROVE: 'End',
                REJECT: 'End',
              },
            },
          },
          initial: 'Submission of Vendor Profile Update Request',
        },
        version: 1,
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
      ///new registration workflow for all services Goods works and services
      {
        id: '1a20640c-5e65-4325-a471-cf20aa19da4c',
        name: 'Submit New Vendor Registration Request',
        label: 'Submitted New Registration Request',
        description: 'Submission of New Registration application',
        bpId: 'c811c2d4-1023-4327-a172-adfcd78a30d5',
        handlerType: 'Requestor',
        taskType: 'ISR',
        checkList: null,
        orderBy: 1,
      },
      {
        id: '4066d458-d4aa-483c-a466-b5483ccbd286',
        name: 'Review New Vendor Registration Request by Registration Officer',
        label: 'Reviewed Vendor Registration Request',
        description: 'Reviewing New Vendor Applications',
        bpId: 'c811c2d4-1023-4327-a172-adfcd78a30d5',
        handlerType: 'Assignee',
        taskType: 'InitialReview',
        checkList: [
          {
            id: '96d95fdb-7852-4ddc-982f-0e94d23d14d3',
            description:
              'All the required information and related documents fullfilled',
            isMandatory: 'true',
          },
        ],
        orderBy: 2,
      },
      {
        id: '31fac537-e71b-479b-9c4a-7f344720598f',
        name: 'Approval of New Vendor Registration Request by Senior or chief registration officer or RRM/DRRM',
        label: 'Reviewed by RO',
        description:
          'aprove new  registration request for Goods by senior or chief registration officer',
        bpId: 'c811c2d4-1023-4327-a172-adfcd78a30d5',
        handlerType: 'Assignee',
        taskType: 'Confirmation',
        checkList: [
          {
            id: '96d95fdb-7852-4ddc-982f-0e96d23d15d3',
            description:
              'All the required information and related documents fullfilled',
            isMandatory: 'true',
          },
        ],
        orderBy: 3,
      },
      {
        id: 'd8f268ac-f85f-4973-94c3-134f753cd25e',
        name: 'Approval of New Vendor Registration Request by Director General (DG)',
        label: 'Approved by DG',
        description:
          'Ensuring that vendors meet the necessary criteria and standards set forth by the organization',
        bpId: 'c811c2d4-1023-4327-a172-adfcd78a30d5',
        handlerType: 'Assignee',
        taskType: 'Approval',
        checkList: [
          {
            id: '96d95fdb-7852-4ddc-982f-0e92d23d15d3',
            description:
              'All the required information and related documents fullfilled',
            isMandatory: 'true',
          },
        ],
        orderBy: 4,
      },
      {
        id: '96752a13-205f-45eb-8b6f-118ebf0c89c7',
        name: 'Generate Vendor Registration Certificate',
        label: 'Generated Certeficates',
        description:
          "Creating a formal certificate to officially recognize and document the registration of a new vendor within the organization's procurement system.This certificate serves as proof of the vendor's successful registration and compliance with the organization's requirements",
        bpId: 'c811c2d4-1023-4327-a172-adfcd78a30d5',
        handlerType: 'Assignee',
        taskType: 'Certificate',
        checkList: null,
        orderBy: 5,
      },


      //renewal Goods, services and Works
      {
        id: '31fac247-e71b-479c-9c4a-7f344720548f',
        name: 'Submit Renewal Registration Request',
        label: 'Submitted Applications ',
        description: 'Submission of Vendor Upgrade Registration Request',
        bpId: 'cd17ba61-a510-4fed-9e50-a3f10b6520d3',
        handlerType: 'Requestor',
        taskType: 'ISR',
        checkList: [
          {
            id: '96d95fdb-7852-4ddc-982f-0e94d23d11d3',
            description:
              'All the required information and related documents fullfilled',
            isMandatory: 'true',
          },
        ],
        orderBy: 1,
      },
      {
        id: '31aac537-e71b-421c-9c4a-7f344820518f',
        name: 'Review Vendor Renewal Registration Request by Registration Officer(RO)',
        label: 'Approved Renewal Application',
        description:
          'Approval of Renewal Registration Request of vendor',
        bpId: 'cd17ba61-a510-4fed-9e50-a3f10b6520d3',
        handlerType: 'Assignee',
        taskType: 'InitialReview',
        checkList: [
          {
            id: '96d95fdb-7852-4ddc-982f-0e94d23d11d3',
            description:
              'All the required information and related documents fullfilled',
            isMandatory: 'true',
          },
        ],
        orderBy: 2,
      },

      {
        id: '61fac7e7-971b-471c-2c5a-7f344820518f',
        name: 'Approval of Renewal Registration Request by Senior or chief registration officer or RRM/DRRM',
        label: 'Reviewed by RO/RRM/DRRM',
        description:
          'Aprove renewal  registration request for Works by senior or chief registration officer',
        bpId: 'cd17ba61-a510-4fed-9e50-a3f10b6520d3',
        handlerType: 'Assignee',
        taskType: 'Confirmation',
        checkList: [
          {
            id: '96d95fdb-7852-4ddc-982f-0e94d23d11d3',
            description:
              'All the required information and related documents fullfilled',
            isMandatory: 'true',
          },
        ],
        orderBy: 3,
      },
      {
        id: '31fbc734-e21b-479c-9c4a-7f384820518f',
        name: 'Approval of Renewal Registration Request of vendor by Director General (DG)',
        label: 'Approved Renewal Request by DG',
        description: 'Final Approval of Vendor registration Renewal by DG',
        bpId: 'cd17ba61-a510-4fed-9e50-a3f10b6520d3',
        handlerType: 'Assignee',
        taskType: 'Approval',
        checkList: [
          {
            id: '96d95fdb-7852-4ddc-982f-0e94d23d11d3',
            description:
              'All the required information and related documents fullfilled',
            isMandatory: 'true',
          },
        ],
        orderBy: 4,
      },

      {
        id: '41fbc737-e712-471c-9c4b-7f345820538f',
        name: 'Generate Vendor Registration Certificate',
        label: 'Generated Certeficate',
        description:
          "Creating a formal certificate to officially recognize and document the upgrade of  vendor within the organization's procurement system.This certificate serves as proof of the vendor's successful registration and compliance with the organization's requirements",
        bpId: 'cd17ba61-a510-4fed-9e50-a3f10b6520d3',
        handlerType: 'Assignee',
        taskType: 'Certificate',
        checkList: [
          {
            id: '96d95fdb-7852-4ddc-982f-0e94d23d11d3',
            description:
              'All the required information and related documents fullfilled',
            isMandatory: 'true',
          },
        ],
        orderBy: 5,
      },

      //////////////////renewal Services
      {
        id: '31fac2b7-e71b-479c-9c4a-7f344720548f',
        name: 'Submit Renewal Registration Request for Services',
        label: 'Submitted Applications ',
        description:
          'Submission of Vendor Upgrade Registration Request for Services',
        bpId: 'b97fb7aa-2442-4e5d-8b42-42bd6ef41138',
        handlerType: 'Requestor',
        taskType: 'ISR',
        checkList: [
          {
            id: '96d95fdb-7852-4ddc-982f-0e94d23d11d3',
            description:
              'All the required information and related documents fullfilled',
            isMandatory: 'true',
          },
        ],
        orderBy: 1,
      },
      {
        id: '313ac537-e71b-471c-9c4a-7f344820518f',
        name: 'Review Vendor Renewal Registration Request by Registration Officer(RO)',
        label: 'Approved Renewal Request',
        description:
          'Approval of Renewal Registration Request of vendor for Service',
        bpId: 'b97fb7aa-2442-4e5d-8b42-42bd6ef41138',
        handlerType: 'Assignee',
        taskType: 'InitialReview',
        checkList: [
          {
            id: '96d95fdb-7852-4ddc-982f-0e94d23d11d3',
            description:
              'All the required information and related documents fullfilled',
            isMandatory: 'true',
          },
        ],
        orderBy: 2,
      },
      {
        id: '31fbc738-e21b-479c-9c4a-7f344820518f',
        name: 'Approval of Renewal Registration Request by Senior or chief registration officer or RRM/DRRM',
        label: 'Reviewed by RO/RRM/DRRM',
        description:
          'Aprove renewal  registration request for Goods by senior or chief registration officer',
        bpId: 'b97fb7aa-2442-4e5d-8b42-42bd6ef41138',
        handlerType: 'Assignee',
        taskType: 'Confirmation',
        checkList: [
          {
            id: '96d95fdb-7852-4ddc-982f-0e94d23d11d3',
            description:
              'All the required information and related documents fullfilled',
            isMandatory: 'true',
          },
        ],
        orderBy: 3,
      },
      {
        id: '61fac7e7-b71b-471c-9c4a-7f344820518f',
        name: 'Approval of Renewal Registration Request of vendor by Director General (DG)',
        label: 'Approved Renewal Request by DG',
        description: 'Final Approval of Vendor renewal request by DG',
        bpId: 'b97fb7aa-2442-4e5d-8b42-42bd6ef41138',
        handlerType: 'Assignee',
        taskType: 'Approval',
        checkList: [
          {
            id: '96d95fdb-7852-4ddc-982f-0e94d23d11d3',
            description:
              'All the required information and related documents fullfilled',
            isMandatory: 'true',
          },
        ],
        orderBy: 4,
      },

      {
        id: '41fbc737-e71b-471c-9c4a-7f345820588f',
        name: 'Generate Vendor Registration Certificate',
        label: 'Generated Certeficate',
        description:
          "Creating a formal certificate to officially recognize and document the renewal of  vendor within the organization's procurement system.This certificate serves as proof of the vendor's successful registration and compliance with the organization's requirements",
        bpId: 'b97fb7aa-2442-4e5d-8b42-42bd6ef41138',
        handlerType: 'Assignee',
        taskType: 'Certificate',
        checkList: [
          {
            id: '96d95fdb-7852-4ddc-982f-0e94d23d11d3',
            description:
              'All the required information and related documents fullfilled',
            isMandatory: 'true',
          },
        ],
        orderBy: 5,
      },
      ///new registration

      ///micro
      {
        id: '96752a13-201f-45eb-8b6f-118ebf0c89c7',
        name: 'Submission of Micro Enterprises(ME) Registration Request',
        label: 'Submitted Micro Enterprise Application Request',
        description: 'Submission of Micro Enterprises Registration Request',
        bpId: 'c0aa3814-f987-4ff1-af44-0ceda7cc9b52',
        handlerType: 'Requestor',
        taskType: 'ISR',
        checkList: null,
        orderBy: 1,
      },
      {
        id: '12752a13-201f-45eb-8b6f-118ebf0c89c9',
        name: 'Approval of Micro Enterprise Registration Request',
        label: 'Submitted Micro Enterprise request',
        description: 'Approval of Micro Enterprises Registration Request',
        bpId: 'c0aa3814-f987-4ff1-af44-0ceda7cc9b52',
        handlerType: 'Assignee',
        taskType: 'Approval',
        checkList: [
          {
            id: '96d95fdb-7852-4ddc-912f-0e94d23d15d3',
            description:
              'The Attached ME certeficate and other documents are valid.',
            isMandatory: 'true',
          },
        ],
        orderBy: 1,
      },
      //small
      {
        id: '95752a14-201f-45eb-8b6f-218ebf0c89c7',
        name: 'Submission of Small Enterprises(SE) Registration Request',
        label: 'Submitted SE Request',
        description: 'Submission of Small Enterprises Registration Request',
        bpId: 'c0aa3814-f987-4ff1-af44-0ceda7cc9b51',
        handlerType: 'Requestor',
        taskType: 'ISR',
        checkList: null,
        orderBy: 1,
      },
      {
        id: '26752a13-201f-45eb-8b6f-118ebf0c79c9',
        name: 'Approval of Small Enterprise Registration Request',
        label: 'Submitted SE Request',
        description: 'Approval of Small Enterprises Registration Request',
        bpId: 'c0aa3814-f987-4ff1-af44-0ceda7cc9b51',
        handlerType: 'Assignee',
        taskType: 'Approval',
        checkList: [
          {
            id: '96d95fdb-7852-4ddc-912f-0e94d23d15d3',
            description:
              'The Attached MSME certeficate and other documents are valid.',
            isMandatory: 'true',
          },
        ],
        orderBy: 1,
      },
      //marginalized
      {
        id: '85752a13-201f-45eb-8b6f-118ebf0c89c7',
        name: 'Submission of Marginalized Group Registration Request',
        label: 'Submitted MG Request',
        description: 'Submission of Marginalized Group Registration Request',
        bpId: 'c0aa3814-f987-4ff1-af44-0ceda7cc9b53',
        handlerType: 'Requestor',
        taskType: 'ISR',
        checkList: null,
        orderBy: 1,
      },
      {
        id: '71752a13-201f-45eb-8b6f-118ebf0c89c4',
        name: 'Approval of Marginalized Group Registration Request',
        label: 'Submitted Marginalized Group Request',
        description: 'Approval of Marginalized Group Registration Request',
        bpId: 'c0aa3814-f987-4ff1-af44-0ceda7cc9b53',
        handlerType: 'Assignee',
        taskType: 'Approval',
        checkList: [
          {
            id: '96d95fdb-7852-4ddc-912f-0e94d23d15d3',
            description:
              'The Attached MSME certeficate and other documents are valid.',
            isMandatory: 'true',
          },
        ],
        orderBy: 1,
      },
      //meduim
      {
        id: '16752a13-201f-45eb-8b6f-118ebf0c89c4',
        name: 'Submission of Medium Enterprise Registration Request',
        label: 'Submitted Medium Enterprise Request',
        description: 'Submission of  Medium Enterprises Registration Request',
        bpId: 'c0aa3814-f987-4ff1-af44-0ceda7cc9b40',
        handlerType: 'Requestor',
        taskType: 'ISR',
        checkList: null,
        orderBy: 1,
      },
      {
        id: '96752a13-201f-45eb-8b6f-118ebf0c89c9',
        name: 'Approval of Medium Enterprises Registration Request',
        label: 'Submitted Medium Enterprise Request',
        description: 'Approval of Medium Enterprises Registration Request',
        bpId: 'c0aa3814-f987-4ff1-af44-0ceda7cc9b40',
        handlerType: 'Assignee',
        taskType: 'Approval',
        checkList: [
          {
            id: '96d95fdb-7852-4ddc-912f-0e94d23d15d3',
            description:
              'The Attached MSME certeficate and other documents are valid.',
            isMandatory: 'true',
          },
        ],
        orderBy: 1,
      },
      ///IBM
      {
        id: '96752a13-205f-45eb-8b5f-118ebf0c89c7',
        name: 'Submission of indigenous black Malawian(IBM) Registration Request',
        label: 'Submitted IBM request',
        description:
          'Submission of indigenous black Malawian(IBM) Registration Request',
        bpId: '329201c3-3218-4e6c-8478-39bee76a43a6',
        handlerType: 'Requestor',
        taskType: 'ISR',
        checkList: [
          {
            id: '96d95fdb-7852-4ddc-912f-0e94d23d15d3',
            description:
              'The Attached IBM certeficate and  other documents are valid.',
            isMandatory: 'true',
          },
        ],
        orderBy: 1,
      },
      {
        id: '96752a13-205f-45eb-8b5f-118ebf0c29c7',
        name: 'Approval of indigenous black Malawian(IBM) Registration Request',
        label: 'Approved IBM request',
        description:
          'Approval of indigenous black Malawian(IBM) Registration Request',
        bpId: '329201c3-3218-4e6c-8478-39bee76a43a6',
        handlerType: 'Assignee',
        taskType: 'Approval',
        checkList: [
          {
            id: '96d95fdb-7852-4ddc-912f-0e94d23d15d3',
            description:
              'The Attached IBM certeficate and  other documents are valid.',
            isMandatory: 'true',
          },
        ],
        orderBy: 1,
      },
      /////////////New  Registration for Goods/////////////////
      {
        id: '1a20640c-5e65-4325-a471-cf20aa19da4c',
        name: 'Submit New Vendor Registration Request for Goods',
        label: 'Submitted New Registration Request',
        description: 'Submission of New Registration application for Goods',
        bpId: 'd822c2d4-1023-4328-a172-adfcd78a30d4',
        handlerType: 'Requestor',
        taskType: 'ISR',
        checkList: null,
        orderBy: 1,
      },
      {
        id: '4066d458-d4aa-483c-a466-b5483ccbd286',
        name: 'Review New Vendor Registration Request by Registration Officer',
        label: 'Reviewed Vendor Registration Request',
        description: 'Reviewing New Vendor Applications for Goods',
        bpId: 'd822c2d4-1023-4328-a172-adfcd78a30d4',
        handlerType: 'Assignee',
        taskType: 'InitialReview',
        checkList: [
          {
            id: '96d95fdb-7852-4ddc-982f-0e94d23d14d3',
            description:
              'All the required information and related documents fullfilled',
            isMandatory: 'true',
          },
        ],
        orderBy: 2,
      },
      {
        id: '31fac537-e71b-479b-9c4a-7f344720598f',
        name: 'Approval of New Vendor Registration Request by Senior or chief registration officer or RRM/DRRM',
        label: 'Reviewed by RO',
        description:
          'aprove new  registration request for Goods by senior or chief registration officer',
        bpId: 'd822c2d4-1023-4328-a172-adfcd78a30d4',
        handlerType: 'Assignee',
        taskType: 'Confirmation',
        checkList: [
          {
            id: '96d95fdb-7852-4ddc-982f-0e96d23d15d3',
            description:
              'All the required information and related documents fullfilled',
            isMandatory: 'true',
          },
        ],
        orderBy: 3,
      },
      {
        id: 'd8f268ac-f85f-4973-94c3-134f753cd25e',
        name: 'Approval of New Vendor Registration Request by Director General (DG)',
        label: 'Approved by DG',
        description:
          'Ensuring that vendors meet the necessary criteria and standards set forth by the organization',
        bpId: 'd822c2d4-1023-4328-a172-adfcd78a30d4',
        handlerType: 'Assignee',
        taskType: 'Approval',
        checkList: [
          {
            id: '96d95fdb-7852-4ddc-982f-0e92d23d15d3',
            description:
              'All the required information and related documents fullfilled',
            isMandatory: 'true',
          },
        ],
        orderBy: 4,
      },
      {
        id: '96752a13-205f-45eb-8b6f-118ebf0c89c7',
        name: 'Generate New Vendor Registration Certificate',
        label: 'Generated Certeficates',
        description:
          "Creating a formal certificate to officially recognize and document the registration of a new vendor within the organization's procurement system.This certificate serves as proof of the vendor's successful registration and compliance with the organization's requirements",
        bpId: 'd822c2d4-1023-4328-a172-adfcd78a30d4',
        handlerType: 'Assignee',
        taskType: 'Certificate',
        checkList: null,
        orderBy: 5,
      },
      // registration for New Service tasks
      {
        id: '4459af13-b86d-4b79-b1b9-2cb2dda76386',
        name: 'Submit New Vendor Registration Request for Services',
        label: 'Submitted New Registration Request',
        description: 'Submission of New Registration application for Services',
        bpId: '96d95fdb-7852-4ddc-982f-0e94d23d15d3',
        handlerType: 'Requestor',
        taskType: 'ISR',
        checkList: null,
        orderBy: 1,
      },
      {
        id: '87ebef7d-75ee-4acc-ac51-0597ffb06d8b',
        name: 'Review New Vendor Registration Request by Registration Officer',
        label: 'Reviewed Vendor Registration Application',
        description: 'Reviewing New Vendor Applications for Services',
        bpId: '96d95fdb-7852-4ddc-982f-0e94d23d15d3',
        handlerType: 'Assignee',
        taskType: 'InitialReview',
        checkList: [
          {
            id: '94d95fdb-7852-4ddc-982f-0e94d23d15d3',
            description:
              'All the required information and related documents fullfilled',
            isMandatory: 'true',
          },
        ],
        orderBy: 2,
      },
      {
        id: '17ff23e0-11d9-46fc-9357-55604cb2c4cb',
        name: 'Approval of New Vendor Registration Request by Senior or chief registration officer or RRM/DRRM',
        label: 'Reviewed by RO',
        description:
          'aprove new  registration request for Services by senior or chief registration officer',
        bpId: '96d95fdb-7852-4ddc-982f-0e94d23d15d3',
        handlerType: 'Assignee',
        taskType: 'Confirmation',
        checkList: [
          {
            id: '96d97fdb-7852-4ddc-982f-0e94d23d15d3',
            description:
              'All the required information and related documents fullfilled',
            isMandatory: 'true',
          },
        ],
        orderBy: 3,
      },
      {
        id: '6428a5a6-1d66-45fe-b0c0-1f34aecb676c',
        name: 'Approval of New Vendor Registration Request by Director General (DG)',
        label: 'Approved by DG',
        description:
          'Ensuring that vendors meet the necessary criteria and standards set forth by the organization',
        bpId: '96d95fdb-7852-4ddc-982f-0e94d23d15d3',
        handlerType: 'Assignee',
        taskType: 'Approval',
        checkList: [
          {
            id: '96d95fdb-7852-4ddc-982f-0e94d23d15d1',
            description:
              'All the required information and related documents fullfilled',
            isMandatory: 'true',
          },
        ],
        orderBy: 4,
      },
      {
        id: '062b9571-b2cf-44c8-a8ad-bd79fdecc2fe',
        name: 'Generate New Vendor Registration Certificate',
        label: 'Generated Certeficates',
        description:
          "creating a formal certificate to officially recognize and document the registration of a new vendor within the organization's procurement system.This certificate serves as proof of the vendor's successful registration and compliance with the organization's requirements",
        bpId: '96d95fdb-7852-4ddc-982f-0e94d23d15d3',
        handlerType: 'Assignee',
        taskType: 'Certificate',
        checkList: null,
        orderBy: 5,
      },

      //Upgrade Registration Request for Goods, services and Works
      {
        id: '31fac537-e71b-479c-9c4a-7b344724518f',
        name: 'Submit Vendor Upgrade Registration Request',
        label: 'Submitted Applications',
        description:
          'Submission of Vendor Upgrade Registration Request',
        bpId: 'abe4ba2c-a260-4bbb-bc8d-f101c33b6dc6',
        handlerType: 'Requestor',
        taskType: 'ISR',
        checkList: [
          {
            id: '96d95fdb-7852-4ddc-982f-0e94d23d11d3',
            description:
              'All the required information and related documents fullfilled',
            isMandatory: 'true',
          },
        ],
        orderBy: 1,
      },
      {
        id: '31fac517-e71b-419c-9c4a-7f344820518f',
        name: 'Review Upgrade Registration Request of Vendor by Registration Officer',
        label: 'Approved Uppgrade Application',
        description:
          'Approval of Vendor Upgrade Registration Request',
        bpId: 'abe4ba2c-a260-4bbb-bc8d-f101c33b6dc6',
        handlerType: 'Assignee',
        taskType: 'InitialReview',
        checkList: [
          {
            id: '96d95fdb-7852-4ddc-982f-0e94d23d11d3',
            description:
              'All the required information and related documents fullfilled',
            isMandatory: 'true',
          },
        ],
        orderBy: 2,
      },
      {
        id: '34fac737-e51b-479c-9c4a-7f344820518f',
        name: 'Approval of Upgrade Registration Request of Vendor by Senior or chief registration officer or RRM/ DRRM',
        label: 'Approved Uppgrade Request by CRO/RRM/DRRM',
        description:
          'Aprove upgrade registration request by senior or chief registration officer',
        bpId: 'abe4ba2c-a260-4bbb-bc8d-f101c33b6dc6',
        handlerType: 'Assignee',
        taskType: 'Confirmation',
        checkList: [
          {
            id: '96d95fdb-7852-4ddc-982f-0e94d23d11d3',
            description:
              'All the required information and related documents fullfilled',
            isMandatory: 'true',
          },
        ],
        orderBy: 3,
      },
      {
        id: '31fac787-e71b-471c-9c4a-7f344820318f',
        name: 'Approval of Upgrade Registration Request of vendor by Director General (DG)',
        label: 'Approved Uppgrade Request by DG',
        description: 'Final Approval of Vendor Upgrade by DG',
        bpId: 'abe4ba2c-a260-4bbb-bc8d-f101c33b6dc6',
        handlerType: 'Assignee',
        taskType: 'Approval',
        checkList: [
          {
            id: '96d95fdb-1852-4ddc-982f-0e94d23d11d3',
            description:
              'All the required information and related documents fullfilled',
            isMandatory: 'true',
          },
        ],
        orderBy: 4,
      },
      {
        id: '41fac737-e76b-471c-9c4a-7f344820518f',
        name: 'Generate Vendor Registration Certificate',
        label: 'Generated Certeficate',
        description:
          "Creating a formal certificate to officially recognize and document the upgrade registration of a vendor within the organization's procurement system.This certificate serves as proof of the vendor's successful registration and compliance with the organization's requirements",
        bpId: 'abe4ba2c-a260-4bbb-bc8d-f101c33b6dc6',
        handlerType: 'Assignee',
        taskType: 'Certificate',
        checkList: [
          {
            id: '96d95fdb-7852-4ddc-982f-0e94d23d11d3',
            description:
              'All the required information and related documents fullfilled',
            isMandatory: 'true',
          },
        ],
        orderBy: 5,
      },
      //--------------------------------end of goods, works and Services

      //----------------------------service upgrade
      {
        id: '31fac537-e71b-669c-9c4a-7f344720518f',
        name: 'Submit Vendor Upgrade Registration Request',
        label: 'Submitted Applications',
        description:
          'Submission of Vendor Upgrade Registration Request for Services',
        bpId: '11a07c2b-2b12-44bc-894e-a1aede0194c4',
        handlerType: 'Requestor',
        taskType: 'ISR',
        checkList: [
          {
            id: '96d95fdb-7852-4ddc-982f-0e94d23d11d3',
            description:
              'All the required information and related documents fullfilled',
            isMandatory: 'true',
          },
        ],
        orderBy: 1,
      },
      {
        id: '31fac537-e71b-479c-1c4a-7f344820518f',
        name: 'Review Upgrade Registration Request of Vendor by Registration Officer',
        label: 'Approved Uppgrade Application',
        description:
          'Approval of  Vendor Upgrade Registration Request for Services',
        bpId: '11a07c2b-2b12-44bc-894e-a1aede0194c4',
        handlerType: 'Assignee',
        taskType: 'InitialReview',
        checkList: [
          {
            id: '96d95fdb-7852-4ddc-982f-0e94d23d11d3',
            description:
              'All the required information and related documents fullfilled',
            isMandatory: 'true',
          },
        ],
        orderBy: 2,
      },
      {
        id: '31fac737-e71b-471c-9c4a-7f344820518f',
        name: 'Approval of Upgrade Registration Request of Vendor by Senior or chief registration officer or RRM/ DRRM',
        label: 'Approved Uppgrade Request by CRO',
        description:
          'Aprove upgrade registration request for Goods by senior or chief registration officer',
        bpId: '11a07c2b-2b12-44bc-894e-a1aede0194c4',
        handlerType: 'Assignee',
        taskType: 'Confirmation',
        checkList: [
          {
            id: '96d95fdb-7852-4ddc-982f-0e94d23d11d3',
            description:
              'All the required information and related documents fullfilled',
            isMandatory: 'true',
          },
        ],
        orderBy: 3,
      },
      {
        id: '31fac737-e715-471c-9c4a-7f344820518f',
        name: 'Approval of Upgrade Registration Request of vendor by Director General (DG)',
        label: 'Approved Uppgrade Request by DG',
        description: 'Final Approval of Vendor Upgrade Application by DG',
        bpId: '11a07c2b-2b12-44bc-894e-a1aede0194c4',
        handlerType: 'Assignee',
        taskType: 'Approval',
        checkList: [
          {
            id: '96d95fdb-7852-4ddc-982f-0e94d23d11d3',
            description:
              'All the required information and related documents fullfilled',
            isMandatory: 'true',
          },
        ],
        orderBy: 4,
      },
      {
        id: '41fac737-231b-471c-9c4a-7f344820518f',
        name: 'Generate Vendor Registration Certificate',
        label: 'Generated Certeficate',
        description:
          "Creating a formal certificate to officially recognize and document the upgrade registration of vendor within the organization's procurement system.This certificate serves as proof of the vendor's successful registration and compliance with the organization's requirements",
        bpId: '11a07c2b-2b12-44bc-894e-a1aede0194c4',
        handlerType: 'Assignee',
        taskType: 'Certificate',
        checkList: [
          {
            id: '96d95fdb-7852-4ddc-982f-0e94d23d11d3',
            description:
              'All the required information and related documents fullfilled',
            isMandatory: 'true',
          },
        ],
        orderBy: 5,
      },
      //--------------------------------end of services

      //----------------------------Works upgrade
      {
        id: '31fac547-e71b-479c-9c4a-7f344720518f',
        name: 'Submit Vendor Upgrade Registration Request',
        label: 'Submitted Applications',
        description:
          'Submission of Vendor Upgrade Registration Request for Works',
        bpId: '950e28cf-ad82-4159-8b2c-f147bbe3685f',
        handlerType: 'Requestor',
        taskType: 'ISR',
        checkList: [
          {
            id: '96d95fdb-7852-4ddc-982f-0e94d23d11d3',
            description:
              'All the required information and related documents fullfilled',
            isMandatory: 'true',
          },
        ],
        orderBy: 1,
      },
      {
        id: '31bac537-e71b-479c-9c4a-7f344820518f',
        name: 'Review Upgrade Registration Request of Vendor by Registration Officer',
        label: 'Approved Uppgrade Application',
        description:
          'Approval of  Vendor Upgrade Registration Request for Works',
        bpId: '950e28cf-ad82-4159-8b2c-f147bbe3685f',
        handlerType: 'Assignee',
        taskType: 'InitialReview',
        checkList: [
          {
            id: '96d95fdb-7852-4ddc-982f-0e94d23d11d3',
            description:
              'All the required information and related documents fullfilled',
            isMandatory: 'true',
          },
        ],
        orderBy: 3,
      },
      {
        id: '31fbc737-e21b-479c-9c4a-7f344820518f',
        name: 'Approval of Upgrade Registration Request by Senior or chief registration officer or RRM/DRRM',
        label: 'Reviewed by CRO/RRM/DRRM',
        description:
          'aprove upgrade  registration request for Services by senior or chief registration officer',

        bpId: '950e28cf-ad82-4159-8b2c-f147bbe3685f',
        handlerType: 'Assignee',
        taskType: 'Confirmation',
        checkList: [
          {
            id: '96d95fdb-7852-4ddc-982f-0e94d23d11d3',
            description:
              'All the required information and related documents fullfilled',
            isMandatory: 'true',
          },
        ],
        orderBy: 4,
      },
      {
        id: '61fac737-c71b-471c-9c4a-7f344820518f',
        name: 'Approval of Upgrade Registration Request of vendor by Director General (DG)',
        label: 'Approved Uppgrade Request by DG',
        description:
          'Final Approval of Vendor Upgrade application by Director General',
        bpId: '950e28cf-ad82-4159-8b2c-f147bbe3685f',
        handlerType: 'Assignee',
        taskType: 'Approval',
        checkList: [
          {
            id: '96d95fdb-7852-4ddc-982f-0e94d23d11d3',
            description:
              'All the required information and related documents fullfilled',
            isMandatory: 'true',
          },
        ],
        orderBy: 5,
      },
      {
        id: '41fbc737-e71b-471c-9c4a-7f345820518f',
        name: 'Generate Vendor Registration Certificate',
        label: 'Generated Certeficate',
        description:
          "Creating a formal certificate to officially recognize and document the upgrade of a vendor within the organization's procurement system.This certificate serves as proof of the vendor's successful registration and compliance with the organization's requirements",
        bpId: '950e28cf-ad82-4159-8b2c-f147bbe3685f',
        handlerType: 'Assignee',
        taskType: 'Certificate',
        checkList: [
          {
            id: '96d95fdb-7852-4ddc-982f-0e94d23d11d3',
            description:
              'All the required information and related documents fullfilled',
            isMandatory: 'true',
          },
        ],
        orderBy: 6,
      },
      //--------------------------------end of works

      //////renewal Works
      {
        id: '31fac247-e71b-379c-9c4a-7fb44721548f',
        name: 'Submit Renewal Registration Request for Works',
        label: 'Submitted Applications ',
        description:
          'Submission of Vendor Upgrade Registration Request for Works',
        bpId: '543d59c0-3b13-401f-bb78-058de7f65a11',
        handlerType: 'Requestor',
        taskType: 'ISR',
        checkList: [
          {
            id: '96d95fdb-7852-4ddc-982f-0e94d23d11d3',
            description:
              'All the required information and related documents fullfilled',
            isMandatory: 'true',
          },
        ],
        orderBy: 1,
      },
      {
        id: '31bac537-e71b-421c-9c4a-7f324820518f',
        name: 'Review Vendor Renewal Registration Request by Registration Officer(RO)',
        label: 'Approved Renewal Request',
        description:
          'Approval of Renewal Registration Request of vendor for Works',
        bpId: '543d59c0-3b13-401f-bb78-058de7f65a11',
        handlerType: 'Assignee',
        taskType: 'InitialReview',
        checkList: [
          {
            id: '96d95fdb-7852-4ddc-982f-0e94d23d11d3',
            description:
              'All the required information and related documents fullfilled',
            isMandatory: 'true',
          },
        ],
        orderBy: 2,
      },

      {
        id: '61fac7e7-471b-471c-9c5a-7f344820518f',
        name: 'Approval of Renewal Registration Request by Senior or chief registration officer or RRM/DRRM',
        label: 'Reviewed by RO/RRM/DRRM',
        description:
          'Aprove renewal  registration request for Works by senior or chief registration officer',
        bpId: '543d59c0-3b13-401f-bb78-058de7f65a11',
        handlerType: 'Assignee',
        taskType: 'Confirmation',
        checkList: [
          {
            id: '96d95fdb-7852-4ddc-982f-0e94d23d11d3',
            description:
              'All the required information and related documents fullfilled',
            isMandatory: 'true',
          },
        ],
        orderBy: 3,
      },
      {
        id: '31fbc739-e21b-4761-9c4a-7f314820518f',
        name: 'Approval of Renewal Registration Request of vendor by Director General (DG)',
        label: 'Approved Renewal Request by DG',
        description: 'Final Approval of Vendor Upgrade by DG',
        bpId: '543d59c0-3b13-401f-bb78-058de7f65a11',
        handlerType: 'Assignee',
        taskType: 'Approval',
        checkList: [
          {
            id: '96d95fdb-7852-4ddc-982f-0e94d23d11d3',
            description:
              'All the required information and related documents fullfilled',
            isMandatory: 'true',
          },
        ],
        orderBy: 4,
      },

      ////Profile update Workflow tasks
      {
        id: '35967d94-dcaa-4449-8b55-a70350f5e698',
        name: 'Submission of Vendor Profile Update Request',
        label: 'Requested Vendor Profile Update',
        description: 'Vendor Profile Update Request',
        bpId: '0f7d46b9-ffd6-4b4c-91f8-9e290d675053',
        handlerType: 'Requestor',
        taskType: 'ISR',
        checkList: [
          {
            id: '96d95fdb-7852-4ddc-982f-0e14d23d15d3',
            description: 'The bank account information is valid',
            isMandatory: 'true',
          },
        ],
        orderBy: 1,
      },
      //Approval of Vendor Profile Update Request

      {
        id: '41fbc737-e71a-471c-9c4a-7f345820598f',
        name: 'Approval of Vendor Profile Update Request',
        label: 'Approved by RO',
        description: 'Approval of Vendor Profile Update Request',
        bpId: '0f7d46b9-ffd6-4b4c-91f8-9e290d675053',
        handlerType: 'Assignee',
        taskType: 'InitialReview',
        checkList: [
          {
            id: '96d95fdb-7852-4ddc-982f-0e94d23d21d3',
            description:
              'All the required information and related documents fullfilled',
            isMandatory: 'true',
          },
        ],
        orderBy: 2,
      },
      {
        id: '277e4d2f-f996-4546-9320-3d5103e22c63',
        name: 'Approval of Vendor Profile Update Request By Director General (Head of PDE)',
        label: 'Vendor Profile Update Request Reviewed by Director General',
        description: 'Vendor Profile Update Request Review by Director General',
        bpId: '0f7d46b9-ffd6-4b4c-91f8-9e290d675053',
        handlerType: 'Assignee',
        taskType: 'Approval',
        checkList: [
          {
            id: '93d95fdb-7852-4ddc-982f-0e94d23d15d3',
            description: 'The bank Information is valid',
            isMandatory: 'true',
          },
        ],
        orderBy: 1,
      },
    ];
    await this.taskService.saveBulk(tasksToSeed);
  }
  @UseGuards(JwtGuard)
  @Post('seed-pricing')
  @ApiOkResponse()
  async seedPricing() {
    const pricesToSeed = [
      //cc6934e1-9706-1e1b-c03f-b35c3e6153a1
      //new registration for goods
      {
        id: '47ec877c-d340-4d89-81f3-3d7d29e968d4',
        serviceId: 'cc6934e1-9706-1e1b-c03f-b35c3e6153a1',
        businessArea: 'Goods',
        valueFrom: 1,
        valueTo: 10000000,
        fee: 10000,
        currency: 'MK',
        tenantId: 0,
      },
      {
        id: 'aa4da85e-39fb-42c1-8808-2a06767f3ae9',
        serviceId: 'cc6934e1-9706-1e1b-c03f-b35c3e6153a1',
        businessArea: 'Goods',
        valueFrom: 10000000,
        valueTo: 30000000,
        fee: 20000,
        currency: 'MK',
        tenantId: 0,
      },
      {
        id: 'a8534c9e-2dc2-4116-a174-d90e8d1023f4',
        serviceId: 'cc6934e1-9706-1e1b-c03f-b35c3e6153a1',
        businessArea: 'Goods',
        valueFrom: 30000000,
        valueTo: 80000000,
        fee: 30000,
        currency: 'MK',
        tenantId: 0,
      },
      {
        id: '2a9b4cde-4184-485d-9452-e433379f6d89',
        serviceId: 'cc6934e1-9706-1e1b-c03f-b35c3e6153a1',
        businessArea: 'Goods',
        valueFrom: 80000000,
        valueTo: 100000000,
        fee: 60000,
        currency: 'MK',
        tenantId: 0,
      },
      {
        id: '8723cd80-873d-48c7-95ad-394b16af133d',
        serviceId: 'cc6934e1-9706-1e1b-c03f-b35c3e6153a1',
        businessArea: 'Goods',
        valueFrom: 100000000,
        valueTo: 500000000,
        fee: 100000,
        currency: 'MK',
        tenantId: 0,
      },
      {
        id: '892e1379-a66f-4c0b-8382-5b248840cae7',
        serviceId: 'cc6934e1-9706-1e1b-c03f-b35c3e6153a1',
        businessArea: 'Goods',
        valueFrom: 1000000000,
        valueTo: -1,
        fee: 500000,
        currency: 'MK',
        tenantId: 0,
      },

      ///end of registration feee for Goods

      // {
      //   id: '81380591-c320-4ed2-a5a0-82b1e4714dd1',
      //   serviceId: 'f40139f8-2861-4c95-a491-08033b13daf4',
      //   businessArea: 'Service',
      //   valueFrom: 20000,
      //   valueTo: 56666,
      //   fee: 1000,
      //   currency: 'MK',
      //   tenantId: 0,
      // },
      //registration fee for service
      {
        id: '099bd8ca-1db1-4555-952d-05681acf8746',
        serviceId: 'cc6934e1-9706-1e1b-c03f-b35c3e6153a1',
        businessArea: 'Services',
        valueFrom: 1,
        valueTo: 10000000,
        fee: 10000,
        currency: 'MK',
        tenantId: 0,
      },
      {
        id: 'be612ffa-7ab0-433d-beeb-cc52ce198e24',
        serviceId: 'cc6934e1-9706-1e1b-c03f-b35c3e6153a1',
        businessArea: 'Services',
        valueFrom: 10000000,
        valueTo: 30000000,
        fee: 20000,
        currency: 'MK',
        tenantId: 0,
      },
      {
        id: '79d4a0e2-ddbd-451a-91b1-1244751b1377',
        serviceId: 'cc6934e1-9706-1e1b-c03f-b35c3e6153a1',
        businessArea: 'Services',
        valueFrom: 30000000,
        valueTo: 80000000,
        fee: 30000,
        currency: 'MK',
        tenantId: 0,
      },
      {
        id: '267c5cb2-5df1-4783-97fa-e3205c5da6be',
        serviceId: 'cc6934e1-9706-1e1b-c03f-b35c3e6153a1',
        businessArea: 'Services',
        valueFrom: 80000000,
        valueTo: 100000000,
        fee: 60000,
        currency: 'MK',
        tenantId: 0,
      },
      {
        id: 'bd7a5794-e950-448f-8590-54dfd869bdf5',
        serviceId: 'cc6934e1-9706-1e1b-c03f-b35c3e6153a1',
        businessArea: 'Services',
        valueFrom: 100000000,
        valueTo: 500000000,
        fee: 100000,
        currency: 'MK',
        tenantId: 0,
      },
      {
        id: '107fcd4f-6c54-4889-972f-cc029eedeeda',
        serviceId: 'cc6934e1-9706-1e1b-c03f-b35c3e6153a1',
        businessArea: 'Services',
        valueFrom: 500000000,
        valueTo: 1000000000,
        fee: 200000,
        currency: 'MK',
        tenantId: 0,
      },
      {
        id: 'b3e6b1f3-7d5c-40d2-8fe9-618bf656e656',
        serviceId: 'cc6934e1-9706-1e1b-c03f-b35c3e6153a1',
        businessArea: 'Services',
        valueFrom: 1000000000,
        valueTo: -1,
        fee: 100000000500000,
        currency: 'MK',
        tenantId: 0,
      },

      ///registration fee for works
      {
        id: '099bd8ca-2db1-4555-952d-05681acf8746',
        serviceId: 'cc6934e1-9706-1e1b-c03f-b35c3e6153a1',
        businessArea: 'Works',
        valueFrom: 1,
        valueTo: 10000000,
        fee: 10000,
        currency: 'MK',
        tenantId: 0,
      },
      {
        id: 'be612ffa-7ab0-433d-beeb-cc52ce198e34',
        serviceId: 'cc6934e1-9706-1e1b-c03f-b35c3e6153a1',
        businessArea: 'Works',
        valueFrom: 10000000,
        valueTo: 30000000,
        fee: 20000,
        currency: 'MK',
        tenantId: 0,
      },
      {
        id: '79d4a0e2-ddbd-451a-91b1-1244751b1387',
        serviceId: 'cc6934e1-9706-1e1b-c03f-b35c3e6153a1',
        businessArea: 'Works',
        valueFrom: 30000000,
        valueTo: 80000000,
        fee: 30000,
        currency: 'MK',
        tenantId: 0,
      },
      {
        id: '267c5cb2-5df1-4783-97fa-e3205c5da5be',
        serviceId: 'cc6934e1-9706-1e1b-c03f-b35c3e6153a1',
        businessArea: 'Works',
        valueFrom: 80000000,
        valueTo: 100000000,
        fee: 60000,
        currency: 'MK',
        tenantId: 0,
      },
      {
        id: 'bd9a5794-e950-448f-8590-54dfd869bdf1',
        serviceId: 'cc6934e1-9706-1e1b-c03f-b35c3e6153a1',
        businessArea: 'Works',
        valueFrom: 100000000,
        valueTo: 500000000,
        fee: 100000,
        currency: 'MK',
        tenantId: 0,
      },
      {
        id: '107fcd4f-6c54-4389-872f-cc029eedeeda',
        serviceId: 'cc6934e1-9706-1e1b-c03f-b35c3e6153a1',
        businessArea: 'Works',
        valueFrom: 500000000,
        valueTo: 1000000000,
        fee: 200000,
        currency: 'MK',
        tenantId: 0,
      },
      {
        id: 'b3e6b1f3-7d5c-40d2-8fe9-118bf656e656',
        serviceId: 'cc6934e1-9706-1e1b-c03f-b35c3e6153a1',
        businessArea: 'Works',
        valueFrom: 1000000000,
        valueTo: -1,
        fee: 100000000500000,
        currency: 'MK',
        tenantId: 0,
      },


      ////////////////////////renewal Service
      {
        id: '799bd8ca-1db1-4555-952d-05681acf8746',
        serviceId: '34be510e-033e-415b-9e3e-8f9795c01765',
        businessArea: 'Services',
        valueFrom: 1,
        valueTo: 10000000,
        fee: 10000,
        currency: 'MK',
        tenantId: 0,
      },
      {
        id: '9e612ffa-7ab0-433d-beeb-cc52ce198e24',
        serviceId: '34be510e-033e-415b-9e3e-8f9795c01765',
        businessArea: 'Services',
        valueFrom: 10000000,
        valueTo: 30000000,
        fee: 20000,
        currency: 'MK',
        tenantId: 0,
      },
      {
        id: '89d4a0e2-ddbd-451a-91b1-1244751b1377',
        serviceId: '34be510e-033e-415b-9e3e-8f9795c01765',
        businessArea: 'Services',
        valueFrom: 30000000,
        valueTo: 80000000,
        fee: 30000,
        currency: 'MK',
        tenantId: 0,
      },
      {
        id: '767c5cb2-5df1-4783-97fa-e3205c5da6be',
        serviceId: '34be510e-033e-415b-9e3e-8f9795c01765',
        businessArea: 'Services',
        valueFrom: 80000000,
        valueTo: 100000000,
        fee: 60000,
        currency: 'MK',
        tenantId: 0,
      },
      {
        id: '3d7a5794-e950-448f-8590-54dfd869bdf5',
        serviceId: '34be510e-033e-415b-9e3e-8f9795c01765',
        businessArea: 'Services',
        valueFrom: 100000000,
        valueTo: 500000000,
        fee: 100000,
        currency: 'MK',
        tenantId: 0,
      },
      {
        id: '207fcd4f-6c54-4889-972f-cc029eed45da',
        serviceId: '34be510e-033e-415b-9e3e-8f9795c01765',
        businessArea: 'Services',
        valueFrom: 500000000,
        valueTo: 1000000000,
        fee: 200000,
        currency: 'MK',
        tenantId: 0,
      },
      {
        id: '63e6b1f3-7d5c-40d2-8fe9-618bf656e656',
        serviceId: '34be510e-033e-415b-9e3e-8f9795c01765',
        businessArea: 'Services',
        valueFrom: 1000000000,
        valueTo: -1,
        fee: 100000000500000,
        currency: 'MK',
        tenantId: 0,
      },
      /////Goods Renewal
      {
        id: '47ec877c-d340-4d99-81f3-3d7d29e968d4',
        serviceId: '34be510e-033e-415b-9e3e-8f9795c01765',
        businessArea: 'Goods',
        valueFrom: 1,
        valueTo: 10000000,
        fee: 10000,
        currency: 'MK',
        tenantId: 0,
      },
      {
        id: 'aa4da88e-39fb-42c1-8808-2a06767f3ae9',
        serviceId: '34be510e-033e-415b-9e3e-8f9795c01765',
        businessArea: 'Goods',
        valueFrom: 10000000,
        valueTo: 30000000,
        fee: 20000,
        currency: 'MK',
        tenantId: 0,
      },
      {
        id: 'a8534c9e-2dc6-4116-a174-d90a8d1023f4',
        serviceId: '34be510e-033e-415b-9e3e-8f9795c01765',
        businessArea: 'Goods',
        valueFrom: 30000000,
        valueTo: 80000000,
        fee: 30000,
        currency: 'MK',
        tenantId: 0,
      },
      {
        id: '2a9b3cde-4184-485d-9452-e433379f6d89',
        serviceId: '34be510e-033e-415b-9e3e-8f9795c01765',
        businessArea: 'Goods',
        valueFrom: 80000000,
        valueTo: 100000000,
        fee: 60000,
        currency: 'MK',
        tenantId: 0,
      },
      {
        id: '8723cd80-973d-48c7-95ad-394b16af133d',
        serviceId: '34be510e-033e-415b-9e3e-8f9795c01765',
        businessArea: 'Goods',
        valueFrom: 100000000,
        valueTo: 500000000,
        fee: 100000,
        currency: 'MK',
        tenantId: 0,
      },
      {
        id: '892e1379-a66f-4c0b-8882-5b248840cae7',
        serviceId: '34be510e-033e-415b-9e3e-8f9795c01765',
        businessArea: 'Goods',
        valueFrom: 1000000000,
        valueTo: -1,
        fee: 500000,
        currency: 'MK',
        tenantId: 0,
      },
      {
        id: 'fad2c120-4d02-4ce6-975a-91b5c0ed828c',
        serviceId: '34be510e-033e-415b-9e3e-8f9795c01765',
        businessArea: 'Goods',
        valueFrom: 100,
        valueTo: 100000,
        fee: 1,
        currency: 'MK',
        tenantId: 0,
      },
      {
        id: '71a9bc4b-3291-4ae7-986c-0bbf704c4336',
        serviceId: '34be510e-033e-415b-9e3e-8f9795c01765',
        businessArea: 'Goods',
        valueFrom: 1,
        valueTo: 1000000,
        fee: 4000,
        currency: 'MK',
        tenantId: 0,
      },
      {
        id: 'e29650a8-889a-4009-9a43-a2e8e5da8cb2',
        serviceId: '34be510e-033e-415b-9e3e-8f9795c01765',
        businessArea: 'Goods',
        valueFrom: 500000000,
        valueTo: 1000000000,
        fee: 200000,
        currency: 'MK',
        tenantId: 0,
      },

      ////renewal price for works mock data for test/not real data
      {
        id: '099bd8ca-2db1-4555-952d-05681acf8746',
        serviceId: '34be510e-033e-415b-9e3e-8f9795c01765',
        businessArea: 'Works',
        valueFrom: 1,
        valueTo: 10000000,
        fee: 10000,
        currency: 'MK',
        tenantId: 0,
      },
      {
        id: 'be612ffa-7ab0-433d-beeb-cc52ce198e34',
        serviceId: '34be510e-033e-415b-9e3e-8f9795c01765',
        businessArea: 'Works',
        valueFrom: 10000000,
        valueTo: 30000000,
        fee: 20000,
        currency: 'MK',
        tenantId: 0,
      },
      {
        id: '79d4a0e2-ddbd-451a-91b1-1244751b1387',
        serviceId: '34be510e-033e-415b-9e3e-8f9795c01765',
        businessArea: 'Works',
        valueFrom: 30000000,
        valueTo: 80000000,
        fee: 30000,
        currency: 'MK',
        tenantId: 0,
      },
      {
        id: '267c5cb2-5df1-4783-97fa-e3205c5da5be',
        serviceId: '34be510e-033e-415b-9e3e-8f9795c01765',
        businessArea: 'Works',
        valueFrom: 80000000,
        valueTo: 100000000,
        fee: 60000,
        currency: 'MK',
        tenantId: 0,
      },
      {
        id: 'bd9a5794-e950-448f-8590-54dfd869bdf1',
        serviceId: '34be510e-033e-415b-9e3e-8f9795c01765',
        businessArea: 'Works',
        valueFrom: 100000000,
        valueTo: 500000000,
        fee: 100000,
        currency: 'MK',
        tenantId: 0,
      },
      {
        id: '107fcd4f-6c54-4389-872f-cc029eedeeda',
        serviceId: '34be510e-033e-415b-9e3e-8f9795c01765',
        businessArea: 'Works',
        valueFrom: 500000000,
        valueTo: 1000000000,
        fee: 200000,
        currency: 'MK',
        tenantId: 0,
      },
      {
        id: 'b3e6b1f3-7d5c-40d2-8fe9-118bf656e656',
        serviceId: '34be510e-033e-415b-9e3e-8f9795c01765',
        businessArea: 'Works',
        valueFrom: 1000000000,
        valueTo: -1,
        fee: 100000000500000,
        currency: 'MK',
        tenantId: 0,
      }


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
        description: 'Plant and motor vehicle spares',
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
        code: 'BgBQWpq2RYC',
        description: 'Consultancy',
        businessArea: 'Services',
        parentId: null,
      },
      {
        id: '393c57f0-9356-a2a2-307d-013968517df8',
        code: 'z0M5bgrUmWu',
        description: 'Provision of security services',
        businessArea: 'Services',
        parentId: null,
      },
      {
        id: 'abed4f3c-a0d4-ed2b-d8ec-7148b7c8d7f6',
        code: 'W7khtX5VV25',
        description: 'Servicing of firefighting equipment',
        businessArea: 'Services',
        parentId: null,
      },
      ////works category

      {
        id: 'f8d4125d-b875-5dcb-81ab-0726b44a54ea',
        code: 'bvqwN2nq9oWW',
        description: 'Construction material supplier',
        businessArea: 'Works',
        parentId: null,
      },
      {
        id: 'cff36da2-5fe7-1ce8-23a3-879a41c3e0c8',
        code: 'hz4MuwBROA8',
        description: 'Construction material manufacturer',
        businessArea: 'Works',
        parentId: null,
      },
      {
        id: '4efe9c57-0a67-964c-9255-112f3b1a64c3',
        code: 'BgBWpq2RYCS',
        description: 'Drilling',
        businessArea: 'Works',
        parentId: null,
      },
      {
        id: '493c57f0-9356-a2a2-307d-013968517df9',
        code: 'z0MbgrUmWuI',
        description: 'Partition and Ceilings',
        businessArea: 'Works',
        parentId: null,
      },
      {
        id: 'abed4f3c-a0d4-ed2b-d8ec-7148b7c8d7f1',
        code: 'W7khtXuVV25L',
        description: 'Architectural Consultants',
        businessArea: 'Works',
        parentId: null,
      },
      {
        id: 'abed4f3c-a0d4-ed2b-d8ec-7148b7c8d7f2',
        code: 'W2khtXuVV25Z',
        description: 'Land Surveying Consultants',
        businessArea: 'Works',
        parentId: null,
      },
      {
        id: 'abed4f3c-a0d4-ed2b-d8ec-7148b7c8d7f3',
        code: 'W7khtXuVV25M',
        description: 'Project Management and Specialist Areas ',
        businessArea: 'Works',
        parentId: null,
      },

      {
        id: 'abed4f3c-a0d4-ed2b-d8ec-7148b7c8d7f4',
        code: 'W7khtXQuVV25',
        description: 'Surveying Consultants',
        businessArea: 'Works',
        parentId: null,
      },
      {
        id: 'abed4f3c-a0d4-ed2b-d8ec-7148b7c8d7f5',
        code: 'W7khtXEuVV25',
        description: 'Environmental Consultants',
        businessArea: 'Works',
        parentId: null,
      },
      {
        id: 'abed7f3c-a0d4-ed2b-d8ec-7148b7c8d7f6',
        code: 'W7khtXuVVO25',
        description: 'Engineering Consultants',
        businessArea: 'Works',
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
