import { InjectRepository } from '@nestjs/typeorm';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { In, Not, Repository } from 'typeorm';
import { SetVendorStatus } from '../dto/vendor.dto';
import {
  VendorInitiationDto,
  VendorInitiationResponseDto,
} from '../dto/vendor-initiation.dto';
import { EntityCrudService } from 'src/shared/service';
import {
  BusinessAreaEntity,
  InvoiceEntity,
  IsrVendorsEntity,
  ProfileInfoEntity,
  ServicePrice,
  VendorsEntity,
} from '@entities';
import { BusinessProcessService } from 'src/modules/bpm/services/business-process.service';
import {
  CreateWorkflowInstanceDto,
  GotoNextStateDto,
  UpdateWorkflowInstanceDto
} from 'src/modules/handling/dto/workflow-instance.dto';
import { VendorStatusEnum } from 'src/shared/enums/vendor-status-enums';
import { WorkflowService } from 'src/modules/bpm/services/workflow.service';
import { InvoiceService } from './invoice.service';
import { CollectionQuery, QueryConstructor } from 'src/shared/collection-query';
import { DataResponseFormat } from 'src/shared/api-data';
import axios from 'axios';
import { FppaDataDto, MbrsDataDto, NCICDataDto } from '../dto/mbrsData.dto';
import { IsrVendorsResponseDto } from '../dto/isrvendor.dto';
import { BusinessAreaDetailResponseDto } from '../dto/business-area.dto';
import { ServicePricingService } from 'src/modules/pricing/services/service-pricing.service';
import { BusinessAreaService } from './business-area.service';
import InitialValueSchema from '../dto/add-vendor.dto';

import { PaymentStatus } from 'src/shared/enums/payment-status.enum';
import { ServiceKeyEnum } from 'src/shared/enums/service-key.enum';
import { ApplicationStatus } from 'src/modules/handling/enums/application-status.enum';
import { BpServiceService } from 'src/modules/services/services/service.service';
import { ReceiptDto } from '../dto/receipt.dto';
import { FileService } from './file.service';
import { HandlingCommonService } from 'src/modules/handling/services/handling-common-services';
import { BusinessCategories } from 'src/modules/handling/enums/business-category.enum';
import { PreferentailTreatmentService } from './preferentail-treatment.service';
import PdfDocumentTemplate from 'src/modules/certificates/templates/pdf-tamplate';

import { ApplicationDto } from '../dto/applications.dto';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class VendorRegistrationsService extends EntityCrudService<VendorsEntity> {
  constructor(
    @InjectRepository(VendorsEntity)
    private readonly vendorRepository: Repository<VendorsEntity>,
    @InjectRepository(BusinessAreaEntity)
    private readonly businessAreaRepository: Repository<BusinessAreaEntity>,
    @InjectRepository(IsrVendorsEntity)
    private readonly isrVendorsRepository: Repository<IsrVendorsEntity>,
    @InjectRepository(ProfileInfoEntity)
    private readonly profileInfoRepository: Repository<ProfileInfoEntity>,
    @InjectRepository(InvoiceEntity)
    private readonly invoiceRepository: Repository<InvoiceEntity>,
    @Inject('VENDOR_REGISTRATION_SERVICE')
    private readonly vendorRegistrationRmqClient: ClientProxy,
    private readonly workflowService: WorkflowService,
    private readonly bpService: BusinessProcessService,
    private readonly serviceService: BpServiceService,
    private readonly invoiceService: InvoiceService,
    private readonly pricingService: ServicePricingService,
    private readonly baService: BusinessAreaService,
    private readonly fileService: FileService,
    private readonly commonService: HandlingCommonService,
    private readonly ptService: PreferentailTreatmentService,
  ) {
    super(vendorRepository);
  }

  testEvent() {
    this.vendorRegistrationRmqClient.emit(
      'vendor-registration-completed-test',
      { test: true },
    );
  }

  private updateVendorEnums: string[] = [
    VendorStatusEnum.DRAFT,
    VendorStatusEnum.ACTIVE,
    VendorStatusEnum.ADJUSTMENT,
    VendorStatusEnum.COMPLETED,
    VendorStatusEnum.SUBMITTED,
    VendorStatusEnum.APPROVED,
  ];

  private onprogressAppStatuses: string[] = [
    VendorStatusEnum.ADJUSTMENT,
    VendorStatusEnum.SUBMITTED,
    VendorStatusEnum.PENDING,
  ];

  async getmyDraftServices(serviceKey: string, user: any) {
    const service = await this.bpService.findBpWithServiceByKey(serviceKey);
    if (!service) return new NotFoundException('Service not defined properly');
    const draftServices =
      await this.baService.getUserInprogressBusinessAreasByServiceId(
        service.id,
        user.id,
      );
    return draftServices;
  }
  async submitVendorInformation(data: any, userInfo: any): Promise<any> {
    try {
      // const manager: EntityManager = this.request[ENTITY_MANAGER_KEY];
      const tempVendor = await this.isrVendorsRepository.findOne({
        where: { userId: userInfo.id, status: Not(VendorStatusEnum.REJECTED) },
        relations: { businessAreas: true },
      });

      if (!tempVendor) throw new HttpException('vendor_not_found', 404);
      if (
        tempVendor.status == VendorStatusEnum.SUBMITTED ||
        tempVendor.status == VendorStatusEnum.APPROVED ||
        tempVendor.status == VendorStatusEnum.COMPLETED
      )
        throw new HttpException('vendor already Exist', 400);

      if (data.status.trim() == VendorStatusEnum.SUBMIT) {
        let response = null;
        const interests = data.areasOfBusinessInterest;
        const interestsLength = interests.length;
        if (interestsLength <= 0)
          throw new HttpException('areas_of_businessInterest_not_found', 404);
        const bp = await this.bpService.findBpWithServiceByKey(
          ServiceKeyEnum.NEW_REGISTRATION,
        );
        if (!bp) throw new NotFoundException('Business_Process_Not_Found');

        let workflowInstance = null;
        const bas = tempVendor?.businessAreas?.filter(
          (item) => item.status !== VendorStatusEnum.REJECTED,
        );

        //const businessAreasLength = bas.length;
        if (bas.length) {
          const instanceId = bas[0].instanceId;
          const dto = new GotoNextStateDto();
          dto.action = 'ISR';
          dto.data = await this.formatData(data);
          dto.instanceId = instanceId;
          workflowInstance = await this.workflowService.gotoNextStep(
            dto,
            userInfo,
          );
          response = {
            applicationNumber: workflowInstance.applicationNumber,
            instanceNumber: workflowInstance.id,
            vendorId: workflowInstance.requestorId,
            serviceId: workflowInstance.serviceId,
          };
        } else {
          const wfi = new CreateWorkflowInstanceDto();
          wfi.user = userInfo;
          wfi.bpId = bp.id;
          wfi.serviceId = bp.serviceId;
          wfi.requestorId = data.id;
          wfi.data = await this.formatData(data);
          workflowInstance = await this.workflowService.intiateWorkflowInstance(
            wfi,
            userInfo,
          );
          workflowInstance = workflowInstance.application;
          if (!workflowInstance)
            throw new HttpException(`workflow_initiation_failed`, 400);
        }
        //update businessarea
        const businessAreaEntities = [];
        for (let i = 0; i < interestsLength; i++) {
          let businessAreaEntity = null;
          if (bas.length) {
            const alreadyExisingBusinessArea =
              await this.businessAreaRepository.findOne({
                where: {
                  category: interests[i].category,
                  vendorId: tempVendor.id,
                  status: VendorStatusEnum.ADJUSTMENT,
                },
              });
            businessAreaEntity = alreadyExisingBusinessArea;
          } else {
            businessAreaEntity = new BusinessAreaEntity();
          }
          businessAreaEntity.instanceId = workflowInstance.id;
          businessAreaEntity.category = interests[i].category;
          businessAreaEntity.serviceId = bp.serviceId;
          businessAreaEntity.applicationNumber =
            workflowInstance.applicationNumber;
          businessAreaEntity.status = VendorStatusEnum.PENDING;
          businessAreaEntity.vendorId = tempVendor.id;
          businessAreaEntity.priceRangeId = interests[i].priceRange;
          businessAreaEntities.push(businessAreaEntity);
        }
        await this.businessAreaRepository.save(businessAreaEntities);
        //prefrenctial treatment
        if (data.preferential?.length) {
          this.ptService.submitPreferential(
            data.preferential,
            userInfo,
            workflowInstance.id,
            workflowInstance.applicationNumber,
          );
        }


        const isrVendor = await this.fromInitialValue(data);
        const initial = isrVendor.initial;
        initial.status = VendorStatusEnum.SUBMITTED;
        initial.level = VendorStatusEnum.SUBMITTED;
        isrVendor.initial = initial;
        isrVendor.status = VendorStatusEnum.SUBMITTED;
        isrVendor.id = tempVendor.id;
        await this.isrVendorsRepository.save(isrVendor);
        response = {
          applicationNumber: workflowInstance.applicationNumber,
          instanceNumber: workflowInstance.id,
          vendorId: workflowInstance.requestorId,
          serviceId: workflowInstance.serviceId,
        };
        return response;
      } else {
        throw new HttpException('invalid status', 400);
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async formatData(data: any) {
    const formattedData: any = { ...data };
    formattedData.areasOfBusinessInterest = [];
    for (const ba of data.areasOfBusinessInterest) {
      const priceRange = await this.pricingService.findOne(ba.priceRange);
      const bi = {
        category: ba.category,
        lineOfBusiness: ba.lineOfBusiness?.map((lob: any) => lob.name),
        priceRange: this.commonService.formatPriceRange(priceRange)
      }
      formattedData.areasOfBusinessInterest.push(bi);
    }
    formattedData.bankAccountDetails = [];
    for (const bank of data.bankAccountDetails) {
      const formated = this.commonService.reduceAttributes(bank);
      formattedData.bankAccountDetails.push(formated);
    }

    formattedData.shareHolders = [];
    for (const share of data.shareHolders) {
      const formated = this.commonService.reduceAttributes(share);
      formattedData.shareHolders.push(formated);
    }
    formattedData.beneficialOwnership = [];
    for (const beneficial of data.beneficialOwnership) {
      const formated = this.commonService.reduceAttributes(beneficial);
      formattedData.shareHolders.push(formated);
    }
    formattedData.preferential = [];
    for (const pt of data.preferential) {
      const formated = this.commonService.reduceAttributes(pt);
      formattedData.preferential.push(formated);
    }
    return formattedData;
  }


  async addDraftVendorInformation(data: any, userInfo: any): Promise<any> {
    try {
      const initiatedVendor = await this.isrVendorsRepository.findOne({
        where: { userId: userInfo.id, status: VendorStatusEnum.DRAFT },
      });
      if (!initiatedVendor)
        throw new HttpException('vendor is not initiated', 400);
      if (
        data.initial.status == VendorStatusEnum.DRAFT ||
        data.initial.status == VendorStatusEnum.SAVE
      ) {
        const isrVendor = await this.fromInitialValue(data);
        if (
          data.initial.level.trim() === VendorStatusEnum.PAYMENT &&
          data.initial.status.trim() === VendorStatusEnum.SAVE
        ) {
          let ncicData = null;
          let fppaData = null;
          const length = data.areasOfBusinessInterest.length;
          for (let index = 0; index < length; index++) {
            if (data.basic.origin == 'MW' || data.basic.origin == 'Malawi') {
              if (
                data.areasOfBusinessInterest[index] === 'work' &&
                ncicData == null
              ) {
                ncicData = await this.GetNCICData(isrVendor.tinNumber);
                if (ncicData == null) {
                  isrVendor.initial.status = VendorStatusEnum.SAVE;
                  isrVendor.initial.level = VendorStatusEnum.PPDA;
                } else {
                  isrVendor.basic.district = ncicData?.district;
                  isrVendor.address.mobilePhone = ncicData?.telephoneNumber;
                  isrVendor.address.postalAddress = ncicData?.postalAddress;
                  isrVendor.address.primaryEmail = ncicData?.email;
                }
              } else if (fppaData == null) {
                fppaData = await this.GetFPPAData(isrVendor.tinNumber);
                if (fppaData !== null) {
                  isrVendor.basic.businessType = fppaData.businessType;
                  isrVendor.contactPersons.mobileNumber = fppaData.mobileNumber;
                  continue;
                }
              } else if (fppaData !== null) {
                continue;
              }
            } else {
              isrVendor.initial.status = VendorStatusEnum.SAVE;
              isrVendor.initial.level = VendorStatusEnum.PPDA;
              // await this.isrVendorsRepository.save(isrVendor);
            }
          }
        }
        let priceRangeIds = [];
        if (data?.areasOfBusinessInterest.length > 0) {
          priceRangeIds = data.areasOfBusinessInterest.map(
            (item: any) => item.priceRange,
          );
        }
        const vendorInfo: any = {
          id: isrVendor?.id,
          name: isrVendor.basic['name'],
        };
        await this.invoiceService.generateInvoice(
          priceRangeIds,
          vendorInfo,
          userInfo,
        );
        await this.isrVendorsRepository.save(isrVendor);
        return { msg: 'Success' };
      } else {
        throw new BadRequestException('invalid status');
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async addService(
    paymentReceiptDto: ReceiptDto,
    attachment: Express.Multer.File,
    user: any,
  ): Promise<any> {
    const subDirectory = 'paymentReceipt';
    try {
      const vendorData = await this.vendorRepository.findOne({
        where: { userId: user.id },
      });
      const srvendor = await this.isrVendorsRepository.findOne({
        where: { userId: user.id },
      });
      if (!vendorData) throw new NotFoundException('vendor not found ');

      if (!vendorData.canRequest)
        throw new NotFoundException(`profile update in progress`);
      let uploadedFileName = null;
      if (attachment) {
        uploadedFileName = await this.fileService.uploadDocuments(
          attachment,
          user,
          subDirectory,
        );
      }

      const paymentReceipt = {
        transactionNumber: paymentReceiptDto?.transactionNumber,
        invoiceId: paymentReceiptDto?.invoiceIds,
        attachment: uploadedFileName,
      };
      srvendor.paymentReceipt = paymentReceipt;
      srvendor.initial.level = VendorStatusEnum.DOC;
      srvendor.initial.status = VendorStatusEnum.SAVE;
      await this.isrVendorsRepository.save(srvendor);
      const ids = JSON.parse(paymentReceiptDto?.invoiceIds);

      for (const row of ids) {
        await this.invoiceRepository.update(row, {
          paymentStatus: PaymentStatus.PAID,
          attachment: uploadedFileName,
        });
      }
      const invoice = await this.invoiceService.getInvoiceByIds(ids);
      const wfi: CreateWorkflowInstanceDto = new CreateWorkflowInstanceDto();
      if (invoice?.paymentStatus == PaymentStatus.PAID) {
        const baCatagories = invoice.paymentDetail.map((item) => item.category);
        const businessAreas =
          await this.baService.getBusinessUppgradesOrRenewal(
            baCatagories,
            ServiceKeyEnum.NEW_REGISTRATION,
          );
        let status: any = ApplicationStatus.PENDING;
        let instanceId = null;
        if (businessAreas.length) {
          status = businessAreas[0].status;
          instanceId = businessAreas[0].instanceId;
        }
        if (status == ApplicationStatus.ADJUSTMENT) {
          const dto = new GotoNextStateDto();
          dto.action = 'ISR';
          dto.data = srvendor;
          dto.instanceId = instanceId;
          const workflowInstance = await this.workflowService.gotoNextStep(
            dto,
            user,
          );
          if (!workflowInstance)
            throw new HttpException(`workflow_initiation_failed`, 400);
          for (const row of businessAreas) {
            row.status = ApplicationStatus.PENDING;
            await this.baService.update(row.id, row);
          }
        } else {
          wfi.bpId = invoice.service.businessProcesses.find(
            (item) => item.isActive == true,
          ).id;
          wfi.serviceId = invoice.serviceId;
          wfi.requestorId = vendorData.id;
          wfi.data = srvendor;
          const resonse = await this.workflowService.intiateWorkflowInstance(
            wfi,
            user,
          );
          for (const row of businessAreas) {
            row.instanceId = resonse.application?.id;
            row.applicationNumber = resonse.application?.applicationNumber;
            await this.baService.update(row.id, row);
          }
        }

        return HttpStatus.CREATED;
      } else {
        return new HttpException('unable to submit application', 400);
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async addVendorInformations(data: any, userInfo: any): Promise<any> {
    try {
      if (
        data.initial.status == VendorStatusEnum.DRAFT ||
        data.initial.status == VendorStatusEnum.SAVE ||
        data.initial.status == VendorStatusEnum.SUBMIT
      ) {
        if (data?.paymentReceipt == undefined || data?.paymentReceipt == null) {
          data.paymentReceipt = {
            transactionId: '',
            category: '',
            invoiceId: '',
            attachment: '',
          };
        }

        const isrVendor = await this.fromInitialValue(data);
        const result = await this.isrVendorsRepository.save(isrVendor);
        if (
          data.initial.level.trim() === VendorStatusEnum.PAYMENT &&
          data.initial.status.trim() === VendorStatusEnum.SAVE
        ) {
          let ncicData = null;
          const fppaData = null;
          const numberOfService = data.areasOfBusinessInterest.length;
          //to get al/ the registration fee for each service
          let priceRangeIds = [];
          if (data?.areasOfBusinessInterest.length > 0) {
            priceRangeIds = data.areasOfBusinessInterest.map(
              (item: any) => item.priceRange,
            );
          }
          for (const row of data.areasOfBusinessInterest) {
            if (data.basic.origin == 'MW' || data.basic.origin == 'Malawi') {
              if (
                row.category === BusinessCategories.WORKS &&
                ncicData == null
              ) {
                ncicData = await this.GetNCICData(isrVendor.tinNumber);
                if (ncicData == null) {
                  isrVendor.initial.status = VendorStatusEnum.SAVE;
                  isrVendor.initial.level = VendorStatusEnum.PPDA;
                  await this.isrVendorsRepository.save(isrVendor);
                } else {
                  isrVendor.basic.district = ncicData?.district;
                  isrVendor.address.mobilePhone = ncicData?.telephoneNumber;
                  isrVendor.address.postalAddress = ncicData?.postalAddress;
                  isrVendor.address.primaryEmail = ncicData?.email;
                  // isrVendor.basic.businessType = ncicData?.typeOfRegistration
                  await this.isrVendorsRepository.save(isrVendor);
                }
              } else if (fppaData == null) {
                //fppaData= await this.GetFPPAData(isrVendor.tinNumber);
                //temporary commented
                if (fppaData !== null) {
                  isrVendor.basic.businessType = fppaData.businessType;
                  isrVendor.contactPersons.mobileNumber = fppaData.mobileNumber;
                  await this.isrVendorsRepository.save(isrVendor);
                  continue;
                }
              } else if (fppaData !== null) {
                continue;
              }
            } else {
              isrVendor.initial.status = VendorStatusEnum.SAVE;
              isrVendor.initial.level = VendorStatusEnum.PPDA;
              await this.isrVendorsRepository.save(isrVendor);
            }
          }

          ///check previosly created invoice
          const vendor: VendorsEntity = new VendorsEntity();
          vendor.id = result.id;
          vendor.name = result.basic['name'];
          const previoseinvoice = await this.invoiceService.getMyInvoice(
            userInfo.id,
            ServiceKeyEnum.NEW_REGISTRATION,
          );
          if (previoseinvoice) {
            if (previoseinvoice.paymentDetail.length != numberOfService) {
              await this.invoiceService.remove(previoseinvoice.id);
              await this.invoiceService.generateInvoice(
                priceRangeIds,
                vendor,
                userInfo,
              );
            }
          } else {
            await this.invoiceService.generateInvoice(
              priceRangeIds,
              vendor,
              userInfo,
            );
          }
        } else if (
          data.initial.level.trim() === VendorStatusEnum.SUBMIT &&
          data.initial.status.trim() === VendorStatusEnum.SUBMIT
        ) {
          return this.submitVendorInformation(data, userInfo);
        }
        return { msg: 'Success' };
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getApplicationStatus(userId: string) {
    const data = await this.isrVendorsRepository.findOne({
      where: { userId: userId, status: In(this.updateVendorEnums) },
      select: { id: true },
    });
    if (!data)
      return {
        status: 'Initial',
      };

    const bas = await this.businessAreaRepository.find({
      where: { vendorId: data.id },
    });

    if (bas.length === 0) {
      return {
        status: ApplicationStatus.DRAFT,
      };
    }

    if (bas.some((ba) => ba.status == ApplicationStatus.PENDING))
      return { status: ApplicationStatus.SUBMITTED };
    else if (bas.some((ba) => ba.status == ApplicationStatus.ADJUSTMENT))
      return { status: ApplicationStatus.ADJUSTMENT };
    else if (
      bas.every(
        (ba) =>
          ba.status == ApplicationStatus.APPROVED ||
          ba.status == ApplicationStatus.OUTDATED,
      )
    )
      return { status: ApplicationStatus.APPROVED };
  }
  fromInitialValue = async (data: any) => {
    let vendorsEntity = new IsrVendorsEntity();
    vendorsEntity = await this.isrVendorsRepository.findOne({
      where: {
        userId: data.userId,
      },
    });
    if (!vendorsEntity) throw new NotFoundException('vendor_not_found!!');
    const initial = vendorsEntity.initial;
    if (vendorsEntity.status === VendorStatusEnum.SUBMITTED)
      throw new HttpException('vendor_already_submitted', 400);
    if (vendorsEntity.status === VendorStatusEnum.APPROVED)
      throw new HttpException('vendor_already_approved', 400);
    vendorsEntity = { id: vendorsEntity.id, ...data };
    initial.status =
      data.initial.status == 'Submit'
        ? VendorStatusEnum.SUBMITTED
        : data.initial.status;
    vendorsEntity.initial = data.initial;
    vendorsEntity.businessAreas =
      vendorsEntity?.businessAreas?.length > 0
        ? vendorsEntity?.businessAreas
        : undefined;
    vendorsEntity.tinNumber = data.basic.tinNumber;
    return vendorsEntity;
  };

  getStatus(status: string): string {
    if (status == ApplicationStatus.APPROVE) {
      return ApplicationStatus.APPROVED;
    } else if (status == ApplicationStatus.ADJUST) {
      return ApplicationStatus.ADJUSTMENT;
    } else if (status == ApplicationStatus.REJECT) {
      return ApplicationStatus.REJECTED;
    } else if (status == ApplicationStatus.SUBMIT) {
      return ApplicationStatus.SUBMITTED;
    }
    return '';
  }
  async setProfileSatus(vendorId: string, status: string, vendor: any) {
    try {
      const profile = await this.profileInfoRepository.findOne({
        where: { vendorId: vendorId, status: ApplicationStatus.SUBMITTED },
      });
      profile.status = this.getStatus(status);
      const profiles = [];
      const oldProfile = await this.profileInfoRepository.find({
        where: { vendorId: vendorId, status: ApplicationStatus.APPROVED },
      });
      for (const row of oldProfile) {
        row.status = ApplicationStatus.OUTDATED;
        profiles.push(row);
      }
      if (profiles.length)
        await this.profileInfoRepository.save(profiles);

      await this.profileInfoRepository.save(profile);
      return await this.mapVendor(vendor, profile);
    } catch (error) {
      throw new Error(error);
    }
  }
  async setPreferentialSatus(status: string, userId: string) {
    const pts = await this.ptService.getSubmittedPTByUserId(userId);
    if (pts.length == 0)
      return true
    const sids = pts.map((row) => row.serviceId);
    const approvedPts = await this.ptService.getPreviousPTByUserId(
      userId,
      sids
    );
    const ptRequestes = [];
    const servicestatus = this.getStatus(status);
    for (const row of pts) {
      const prevPt = approvedPts.find(
        (item) => item.serviceId == row.serviceId,
      );
      if (prevPt && servicestatus == ApplicationStatus.APPROVED) {
        prevPt.status = ApplicationStatus.OUTDATED;
        await this.ptService.update(prevPt.id, prevPt);
      }
      row.status = servicestatus;
      ptRequestes.push(row);
    }
    if (ptRequestes.length) {
      await this.ptService.saveAll(ptRequestes);
    }
  }

  async changeBusinessAreasStatus(instanceId: string, status: string) {
    const response = [];
    const currentBusinessArea = await this.businessAreaRepository.find({
      where: {
        instanceId: instanceId,
      },
    });
    if (currentBusinessArea.length === 0)
      throw new BadRequestException(`businessArea_not_found`);

    for (const row of currentBusinessArea) {
      row.status = status;
      row.remark = status;
      response.push(row);
    }
    await this.businessAreaRepository.save(response);
    return response;
  }

  async changeApplicationStatus(
    command: SetVendorStatus,
    vendor: IsrVendorsEntity,
  ) {
    const response = [];
    const currentBusinessArea =
      await this.baService.getVendorBusinessAreaByInstanceId(
        command.instanceId,
        command.isrVendorId,
      );
    if (currentBusinessArea.length)
      throw new BadRequestException(`businessArea_not_found`);
    const serviceStatus = this.getStatus(command.status);
    const coreServices = [
      ServiceKeyEnum.NEW_REGISTRATION,
      ServiceKeyEnum.REGISTRATION_RENEWAL,
      ServiceKeyEnum.REGISTRATION_UPGRADE,
    ];

    for (const row of currentBusinessArea) {
      row.status = serviceStatus;
      row.remark = command.remark;
      row.approvedAt = new Date();
      if (
        coreServices.some((item) => item == row.BpService.key) &&
        serviceStatus == ApplicationStatus.APPROVE
      ) {
        const expireDate = new Date();
        expireDate.setFullYear(expireDate.getFullYear() + 1);
        row.expireDate = expireDate;
      }
      if (row.BpService.key == ServiceKeyEnum.NEW_REGISTRATION) {
        const invoice = await this.invoiceService.getInvoicesByUserAndService(
          command.userId,
          row.serviceId,
        );
        if (invoice) {
          invoice.paymentStatus = PaymentStatus.COMPLETED;
          await this.invoiceService.update(invoice.id, invoice);
        }
      } else if (row.BpService.key == ServiceKeyEnum.REGISTRATION_RENEWAL) {
        const previousBA = await this.baService.getPreviousService(
          command.isrVendorId,
          row.category,
        );
        if (previousBA) {
          previousBA.status = ApplicationStatus.OUTDATED;
          await this.baService.update(previousBA.id, previousBA);
        }
        const invoice = await this.invoiceService.getInvoicesByUserAndService(
          command.userId,
          row.serviceId,
        );
        if (invoice) {
          invoice.paymentStatus = PaymentStatus.COMPLETED;
          await this.invoiceService.update(invoice.id, invoice);
        }
      } else if (row.BpService.key == ServiceKeyEnum.REGISTRATION_UPGRADE) {
        const previousBA = await this.baService.getPreviousService(
          command.isrVendorId,
          row.category,
        );
        if (previousBA) {
          previousBA.status = ApplicationStatus.OUTDATED;
          await this.baService.update(previousBA.id, previousBA);
        }
        const invoice = await this.invoiceService.getInvoicesByUserAndService(
          command.userId,
          row.serviceId,
        );
        if (invoice) {
          invoice.paymentStatus = PaymentStatus.COMPLETED;
          await this.invoiceService.update(invoice.id, invoice);
        }
      } else if (row.BpService.key == ServiceKeyEnum.PROFILE_UPDATE) {
        this.setProfileSatus(command.isrVendorId, command.status, vendor);
      } else if (
        this.commonService
          .getServiceCatagoryKeys(ServiceKeyEnum.PREFERENCTIAL)
          .some((item) => item == row.BpService.key)
      ) {
        await this.setPreferentialSatus(command.status, command.userId);
      }
      response.push(row);
    }
    await this.baService.saveAll(response);
    return response;
  }
  async updateVendor(vendorStatusDto: SetVendorStatus): Promise<any> {
    const service = await this.serviceService.findOne(
      vendorStatusDto.serviceId,
    );
    if (!service) throw new HttpException('Bp service not found', 404);
    try {
      const result = await this.isrVendorsRepository.findOne({
        where: {
          userId: vendorStatusDto.userId,
          status: In(this.updateVendorEnums),
        },
      });
      if (!result) throw new NotFoundException(`isr_Vendor_not_found`);
      const vendor = await this.vendorRepository.findOne({
        where: { isrVendorId: vendorStatusDto.isrVendorId },
      });
      if (service.key == ServiceKeyEnum.PROFILE_UPDATE) {
        await this.setProfileSatus(
          vendorStatusDto.isrVendorId,
          vendorStatusDto.status,
          vendor,
        );
      }

      if (vendor) {
        const businessAreas = await this.businessAreaRepository.find({
          where: { instanceId: vendorStatusDto.instanceId },
          relations: { BpService: true },
        });

        for (const ba of businessAreas) {
          if (vendorStatusDto.status == VendorStatusEnum.APPROVE) {
            ba.status = VendorStatusEnum.APPROVED;
          } else if (vendorStatusDto.status == VendorStatusEnum.REJECT) {
            ba.status = VendorStatusEnum.REJECTED;
          }
          ba.approvedAt = new Date();
          if ([ServiceKeyEnum.PROFILE_UPDATE, ServiceKeyEnum.REGISTRATION_UPGRADE].filter((item) => item == service.key).length == 0) {
            const expireDate = new Date();
            expireDate.setFullYear(expireDate.getFullYear() + 1);
            ba.expireDate = expireDate;
          }
          if (
            ServiceKeyEnum.REGISTRATION_RENEWAL == service.key ||
            ServiceKeyEnum.REGISTRATION_UPGRADE == service.key
          ) {
            const previousBA = await this.businessAreaRepository.findOne({
              where: {
                status: ApplicationStatus.APPROVED,
                category: ba.category,
                //instanceId: Not(vendorStatusDto.instanceId),
                vendorId: vendorStatusDto.isrVendorId,
              },
            });
            if (previousBA) {
              previousBA.status = ApplicationStatus.OUTDATED;
              await this.businessAreaRepository.save(previousBA);
            }
          }
          ba.remark = vendorStatusDto.remark;
          await this.businessAreaRepository.save(ba);
        }
        if (ServiceKeyEnum.NEW_REGISTRATION == service.key) {
          this.updateBusinessInterestArea(result);
          await this.setPreferentialSatus(vendorStatusDto.status, vendorStatusDto.userId);

        } else if (this.commonService.getPreferencialServices().some((item) => item == service.key)) {
          await this.setPreferentialSatus(vendorStatusDto.status, vendorStatusDto.userId);
        }
      } else {
        if (vendorStatusDto.status == VendorStatusEnum.APPROVE) {
          const isrVendorData = result;
          const initial = isrVendorData.initial;
          const appliedServices =
            await this.baService.getVendorRegisteredServices(
              vendorStatusDto.isrVendorId,
            );
          if (appliedServices?.length >= 3) {
            initial.status = VendorStatusEnum.COMPLETED;
            initial.level = VendorStatusEnum.COMPLETED;
            result.status = VendorStatusEnum.COMPLETED;
          } else {
            result.status = VendorStatusEnum.APPROVED;
          }
          await this.isrVendorsRepository.save(result);

          const newlySavedVendor = await this.saveSRAsVendor(result);

          // TRIGGER RMQ EVENT TO IAM AFTER GENERATING EGP REGISTRATION NUMBER
          const eventPayload = {
            name: newlySavedVendor.name,
            accountId: newlySavedVendor.userId,
            egpRegistrationNumber: newlySavedVendor.registrationNumber,
            email: result.address.primaryEmail,
          };

          this.vendorRegistrationRmqClient.emit(
            'vendor-registration-completed',
            eventPayload,
          );
          const bas = await this.baService.getVendorBusinessAreaByInstanceId(
            vendorStatusDto.isrVendorId,
            vendorStatusDto.instanceId,
          );
          if (bas.length == 0)
            throw new HttpException(
              `businessArea_not_found`,
              HttpStatus.NOT_FOUND,
            );
          //update states of each service and categories
          const expiryServices = [
            ServiceKeyEnum.NEW_REGISTRATION,
            ServiceKeyEnum.REGISTRATION_UPGRADE,
            ServiceKeyEnum.REGISTRATION_RENEWAL,
          ];
          for (const ba of bas) {
            ba.status = VendorStatusEnum.APPROVED;
            ba.approvedAt = new Date();
            ba.remark = vendorStatusDto.remark;
            if (
              expiryServices.filter((item) => service.key == item).length > 0
            ) {
              const expireDate = new Date();
              expireDate.setFullYear(expireDate.getFullYear() + 1);
              ba.expireDate = expireDate;
            }
            await this.businessAreaRepository.save(ba);
          }
          this.setPreferentialSatus(vendorStatusDto.status, vendorStatusDto.userId);
          await this.permitForOtherServiceRequest(vendorStatusDto.isrVendorId);
          return true;
        } else {
          const result = await this.rejectVendor(vendorStatusDto);
          await this.permitForOtherServiceRequest(vendorStatusDto.isrVendorId);
          return result;
        }
      }

      return true;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async permitForOtherServiceRequest(vendorId: string) {
    const vendor = await this.vendorRepository.findOne({
      where: { id: vendorId },
    });
    if (vendor) {
      vendor.canRequest = true;
      await this.vendorRepository.update(vendor.id, vendor);
    }
    return true;
  }

  async updateBusinessInterestArea(isrVendor: IsrVendorsEntity) {
    const vendor_ = await this.vendorRepository.findOne({
      where: { id: isrVendor.id },
      relations: { areasOfBusinessInterest: true },
    });
    const bias = [];
    for (const row of isrVendor.areasOfBusinessInterest) {
      if (
        vendor_.areasOfBusinessInterest.some(
          (item) => item.category == row.category,
        )
      ) {
        bias.push(row);
      } else {
        bias.push({
          category: row.category,
          priceRange: row.priceRange,
          lineOfBusiness: row.lineOfBusiness,
          vendorId: isrVendor.id,
        });
      }
    }
    vendor_.areasOfBusinessInterest = [...bias];
    this.vendorRepository.save(vendor_);
  }
  async saveSRAsVendor(isrVendorData: IsrVendorsEntity) {
    const vendorEntity = new VendorsEntity();
    vendorEntity.id = isrVendorData.id;
    vendorEntity.status = VendorStatusEnum.APPROVED;
    vendorEntity.level = VendorStatusEnum.COMPLETED;
    vendorEntity.name = isrVendorData.basic.name;
    vendorEntity.formOfEntity = isrVendorData.basic.businessType;
    vendorEntity.origin = isrVendorData.basic?.origin;
    vendorEntity.district = isrVendorData.basic?.district;
    vendorEntity.tin = isrVendorData.basic?.tinNumber;
    vendorEntity.userId = isrVendorData.userId;
    vendorEntity.isrVendorId = isrVendorData.id;
    vendorEntity.shareholders = isrVendorData.shareHolders;
    vendorEntity.vendorAccounts = isrVendorData.bankAccountDetails;
    vendorEntity.areasOfBusinessInterest =
      isrVendorData.areasOfBusinessInterest;
    vendorEntity.beneficialOwnership = isrVendorData.beneficialOwnership;
    vendorEntity.registrationNumber =
      await this.commonService.generateApplicationNumber('MW', 'EGP');
    let tempMetadata = null;
    tempMetadata = {
      address: isrVendorData.address,
      contactPersons: isrVendorData.contactPersons,
      businessSizeAndOwnership: isrVendorData.businessSizeAndOwnership,
      supportingDocuments: isrVendorData.supportingDocuments,
      paymentReceipt: isrVendorData.paymentReceipt,
      initial: isrVendorData.initial,
    };
    vendorEntity.metaData = tempMetadata;
    return await this.vendorRepository.save(vendorEntity);
  }

  //update vendor while profile update
  async mapVendor(vendor: VendorsEntity, profileData: ProfileInfoEntity) {
    try {
      vendor.name = profileData.profileData?.basic?.name;
      vendor.formOfEntity = profileData.profileData?.basic?.businessType;
      vendor.origin = profileData.profileData?.basic?.origin;

      vendor.district = profileData.profileData?.basic?.district;
      vendor.shareholders = profileData.profileData?.shareHolders;
      vendor.vendorAccounts = profileData.profileData?.bankAccountDetails;
      // vendor.areasOfBusinessInterest =
      //   profileData.profileData?.areasOfBusinessInterest;
      vendor.beneficialOwnership = profileData.profileData?.beneficialOwnership;
      let tempMetadata = null;
      tempMetadata = {
        address: profileData.profileData?.address,
        contactPersons: profileData.profileData?.contactPersons,
        businessSizeAndOwnership:
          profileData.profileData?.businessSizeAndOwnership,
        supportingDocuments: profileData.profileData?.supportingDocuments,
        paymentReceipt: profileData.profileData?.paymentReceipt,
        invoice: profileData.profileData?.invoice,
      };
      vendor.metaData = tempMetadata;
      await this.vendorRepository.save(vendor);
      return true;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async getInvoiceByUserId(userId: string) {
    const pendingInvoices = await this.invoiceRepository.find({
      where: { userId: userId, paymentStatus: VendorStatusEnum.PENDING },
    });
    return pendingInvoices;
  }
  async rejectVendor(vendorStatusDto: SetVendorStatus): Promise<any> {
    try {
      const serviceType = await this.serviceService.findOne(
        vendorStatusDto.serviceId,
      );
      if (!serviceType) throw new NotFoundException('Bp service not found');
      if (
        serviceType &&
        serviceType.key == VendorStatusEnum.PROFILE_UPDATE_KEY &&
        vendorStatusDto.status == VendorStatusEnum.REJECT
      ) {
        const vendor = await this.vendorRepository.findOne({
          where: { isrVendorId: vendorStatusDto.isrVendorId },
        });
        const profileData = await this.profileInfoRepository.findOne({
          where: { vendorId: vendor.id, status: VendorStatusEnum.SUBMITTED },
        });
        if (!profileData) throw new NotFoundException(` profile not found`);
        const profile = await this.profileInfoRepository.update(
          { id: profileData.id },
          { status: VendorStatusEnum.REJECTED },
        );
        return profile;
      } else {
        const vendor = await this.vendorRepository.findOne({
          where: { userId: vendorStatusDto.userId },
        });
        if (!vendor) {
          await this.isrVendorsRepository.update(
            { id: vendorStatusDto.isrVendorId },
            { status: VendorStatusEnum.REJECTED },
          );
        }
        return await this.changeBusinessAreasStatus(
          vendorStatusDto.instanceId,
          VendorStatusEnum.REJECTED,
        );
      }
    } catch (error) {
      throw error;
    }
  }
  async adjustVendor(vendorStatusDto: SetVendorStatus): Promise<any> {
    try {
      const serviceType = await this.serviceService.findOne(
        vendorStatusDto.serviceId,
      );
      if (!serviceType) throw new NotFoundException('Bp service not found');
      if (serviceType.key === VendorStatusEnum.PROFILE_UPDATE_KEY) {
        const vendor = await this.vendorRepository.findOne({
          where: { isrVendorId: vendorStatusDto.isrVendorId },
        });
        if (!vendor) throw new NotFoundException(' vendor not found');
        const currentBusinessArea = await this.businessAreaRepository.findOne({
          where: {
            vendorId: vendor.id,
            instanceId: vendorStatusDto.instanceId,
          },
        });
        if (!currentBusinessArea)
          throw new BadRequestException(`businessArea_not_found`);
        currentBusinessArea.status = VendorStatusEnum.ADJUSTMENT;
        currentBusinessArea.remark = vendorStatusDto.remark;
        const businessArea =
          await this.businessAreaRepository.save(currentBusinessArea);
        if (!businessArea)
          throw new BadRequestException(`business_area_update_failed`);
        const profileData = await this.profileInfoRepository.findOne({
          where: {
            vendorId: vendor.id,
            status: In([
              VendorStatusEnum.SUBMITTED,
              VendorStatusEnum.ADJUSTMENT,
            ]),
          },
        });
        if (!profileData) throw new NotFoundException(` profile not found`);
        profileData.status = VendorStatusEnum.ADJUSTMENT;
        await this.profileInfoRepository.save(profileData);
        return businessArea;
      } else {
        const vendor = await this.vendorRepository.findOne({
          where: { userId: vendorStatusDto.userId },
        });

        if (!vendor) {
          const initial: any = {
            level: VendorStatusEnum.DETAIL,
            status: VendorStatusEnum.DRAFT,
          };
          await this.isrVendorsRepository.update(
            { id: vendorStatusDto.isrVendorId },
            { status: VendorStatusEnum.ADJUSTMENT, initial: initial },
          );
          const invoice = await this.invoiceService.getInvoicesByUserAndService(
            vendorStatusDto.userId,
            vendorStatusDto.serviceId,
          );
          if (invoice) {
            invoice.paymentStatus = PaymentStatus.PENDING;
            await this.invoiceService.update(invoice.id, invoice);
          }
        }
        return await this.changeBusinessAreasStatus(
          vendorStatusDto.instanceId,
          VendorStatusEnum.ADJUSTMENT,
        );
      }
    } catch (error) {
      throw error;
    }
  }

  async vendorInitiation(
    vendorInitiationDto: VendorInitiationDto,
    userInfo: any,
  ): Promise<any> {
    if (vendorInitiationDto.country == 'MW') {
      const mbrsDataDto = new MbrsDataDto();
      mbrsDataDto.tin = vendorInitiationDto.tinNumber;
      mbrsDataDto.issuedDate = vendorInitiationDto.tinIssuedDate;
      const result = await this.GetMBRSData(mbrsDataDto);
      if (result == null) throw new NotFoundException('something went wrong');
      if (!result) throw new NotFoundException('something went wrong');
    }
    const vendor = await this.isrVendorsRepository.findOne({
      where: {
        userId: userInfo.id,
        status: In(this.updateVendorEnums),
      },
    });
    if (vendor) return { id: vendor.id, message: 'vendor exist' };
    if (vendorInitiationDto.tinNumber) {
      const vendorByTinExists = await this.isrVendorsRepository.findOne({
        where: {
          tinNumber: vendorInitiationDto.tinNumber,
          status: In(this.updateVendorEnums),
        },
      });
      if (vendorByTinExists)
        return {
          tin: vendorInitiationDto.tinNumber,
          message: 'tin_already_already_exist',
        };
    }
    const vendorsEntity = new IsrVendorsEntity();
    vendorsEntity.userId = userInfo.id;
    vendorsEntity.tinNumber = vendorInitiationDto?.tinNumber;
    vendorsEntity.status = VendorStatusEnum.DRAFT;
    const initial = {
      userId: userInfo.id,
      status: vendorInitiationDto.status,
      level: vendorInitiationDto.level,
      issueDate: vendorInitiationDto.tinIssuedDate,
    };
    vendorsEntity.initial = initial;
    vendorsEntity.basic = vendorInitiationDto;
    try {
      const result = await this.isrVendorsRepository.save(vendorsEntity);
      if (result) {
        return { vendorId: result.id };
      }
    } catch (error) {
      throw error;
    }
  }

  async getIsrVendorInvoiceByUserId(userId: string): Promise<any> {
    try {
      const vendorEntity = await this.isrVendorsRepository.findOne({
        where: {
          userId: userId,
          status: In(this.updateVendorEnums),
        },
      });
      if (!vendorEntity) {
        throw new HttpException('isr_vendor_not_found', HttpStatus.BAD_REQUEST);
      }
      const invoice = await this.invoiceService.getMyInvoice(
        userId,
        ServiceKeyEnum.NEW_REGISTRATION,
      );

      return { ...vendorEntity, invoice: { ...invoice } };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async getIsrVendorByStatusBUserId(userId: string, status: string) {
    const vendorEntity = await this.isrVendorsRepository.findOne({
      select: {
        id: true,
        basic: true,
        initial: true,
        status: true,
        areasOfBusinessInterest: true,
        businessAreas: true,
      },
      relations: { businessAreas: { BpService: true } },
      where: {
        userId: userId,
        status: In(this.updateVendorEnums),
        businessAreas: { status: status },
      },
    });
    if (!vendorEntity) throw new NotFoundException('vendor Not found');

    return {
      name: vendorEntity?.basic.name,
      tinNumber: vendorEntity?.basic.tinNumber,
      level: vendorEntity.initial?.level,
      vendorStatus: vendorEntity.status,
      Status: vendorEntity.initial?.status,
      areasOfBusinessInterest: vendorEntity.areasOfBusinessInterest,
      services: vendorEntity.businessAreas,
    };
  }
  async getPendingIsrVendorByUserId(userId: string): Promise<any> {
    const vendorEntity = await this.isrVendorsRepository.findOne({
      select: {
        id: true,
        basic: true,
        initial: true,
        status: true,
        areasOfBusinessInterest: true,
        businessAreas: true,
      },
      relations: { businessAreas: { BpService: true } },
      where: {
        userId: userId,
        status: In(this.updateVendorEnums),
        businessAreas: { status: In(this.onprogressAppStatuses) },
      },
    });
    if (!vendorEntity) throw new NotFoundException('vendor Notfound');

    return {
      name: vendorEntity?.basic.name,
      tinNumber: vendorEntity?.basic.tinNumber,
      level: vendorEntity.initial?.level,
      vendorStatus: vendorEntity?.status,
      Status: vendorEntity.initial?.status,
      areasOfBusinessInterest: vendorEntity?.areasOfBusinessInterest,
      services: vendorEntity?.businessAreas,
    };
  }
  async getPendingServices(userId: string): Promise<any> {
    const vendorEntity = await this.isrVendorsRepository.findOne({
      select: {
        id: true,
        basic: true,
        initial: true,
        status: true,
        areasOfBusinessInterest: true,
        businessAreas: true,
      },
      relations: { businessAreas: { BpService: true } },
      where: {
        userId: userId,
        status: In(this.updateVendorEnums),
        businessAreas: { status: In(['Pending']) },
      },
    });
    if (!vendorEntity) throw new NotFoundException('vendor Notfound');
    vendorEntity.businessAreas.filter((item) =>
      vendorEntity.areasOfBusinessInterest.some(
        (data) => item.category === data.category,
      ),
    );
    return {
      name: vendorEntity?.basic.name,
      tinNumber: vendorEntity?.basic.tinNumber,
      level: vendorEntity.initial?.level,
      vendorStatus: vendorEntity.status,
      Status: vendorEntity.initial?.status,
      areasOfBusinessInterest: vendorEntity.areasOfBusinessInterest,
      services: vendorEntity.businessAreas,
    };
  }
  async getVendorByUserId(userId: string): Promise<any> {
    try {
      const vendorEntity = await this.vendorRepository.findOne({
        where: { userId: userId, status: In(this.updateVendorEnums) },
        relations: {
          shareholders: true,
          vendorAccounts: { bank: true },
          beneficialOwnership: true,
          areasOfBusinessInterest: true,
          isrVendor: { businessAreas: true },
        },
      });
      if (!vendorEntity) return null;

      const { isrVendor, ...vendor } = vendorEntity;
      const { businessAreas } = isrVendor;

      const vendorEntityRes = { vendor, businessAreas };
      return vendorEntityRes;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async getIsrVendorByVendorId(vendorId: string): Promise<any> {
    try {
      const vendorEntity = await this.isrVendorsRepository.findOne({
        where: {
          id: vendorId,
        },
      });
      return vendorEntity;
    } catch (error) {
      throw error;
    }
  }
  async getVendor(userId: string): Promise<VendorsEntity> {
    try {
      const vendorEntity = await this.vendorRepository.findOne({
        where: {
          userId: userId,
        },
      });
      return vendorEntity;
    } catch (error) {
      throw error;
    }
  }
  async getApplicationsByUserIdAndStatus(
    userId: string,
    status: string,
  ): Promise<any> {
    try {
      const applications = await this.isrVendorsRepository.findOne({
        where: {
          userId: userId,
          status: In(this.updateVendorEnums),
        },
        relations: { businessAreas: true },
      });
      const businessAreaByStatus = applications.businessAreas.filter(
        (item) => item.status == status,
      );
      return businessAreaByStatus;
    } catch (error) {
      throw error;
    }
  }
  async getIsrVendorByUserId(
    userId: string,
    flag: string = null,
  ): Promise<any> {
    try {
      const vendorEntity: any = await this.isrVendorsRepository.findOne({
        relations: { businessAreas: true },
        where: {
          userId: userId,
          status: In(this.updateVendorEnums),
        },
      });
      if (vendorEntity?.areasOfBusinessInterest) {
        const formattedAreaOfBi = [];
        const pricesIds = vendorEntity?.areasOfBusinessInterest.map(
          (item: any) => item.priceRange,
        );
        const priceRanges =
          await this.pricingService.findPriceRangeByIds(pricesIds);

        for (const price of priceRanges) {
          for (const bi of vendorEntity?.areasOfBusinessInterest) {
            if (bi.priceRange == price.id) {
              const priceRange = this.commonService.formatPriceRange(price);
              const lob = bi.lineOfBusiness.map((item: any) => item.name);
              formattedAreaOfBi.push({
                category: bi.category,
                priceRange: priceRange,
                lineOfBusiness: lob,
              });
            }
          }
        }
        vendorEntity.areasOfBusinessInterestView = formattedAreaOfBi;
        const invoice = this.invoiceService.getInvoiceByUser(userId);
        if (invoice) {
          vendorEntity.invoice = invoice;
        }
      }

      // getting the preferential treatments  if any
      const keys = this.commonService.getPreferencialServices();
      const ptResult = await this.ptService.getPreferetialTreatments(
        keys,
        userId,
      );
      const formattedPt = [];
      const keys_ = this.commonService.getServiceCatagoryKeys(
        ServiceKeyEnum.MSME,
      );
      if (ptResult.length) {
        for (const pt of ptResult) {
          if (keys_.filter((item) => item == pt.service.key).length) {
            formattedPt.push({
              id: pt.id,
              serviceId: pt.serviceId,
              category: ServiceKeyEnum.MSME.toLowerCase(),
              type: pt.service.key,
              certiNumber: pt.certiNumber,
              certificateUrl: pt.certificateUrl,
            });
          } else {
            if (pt.service.key == ServiceKeyEnum.MARGINALIZED_GROUP) {
              formattedPt.push({
                id: pt.id,
                serviceId: pt.serviceId,
                category: 'marginalized',
                type: 'marginalized',
                certiNumber: pt.certiNumber,
                certificateUrl: pt.certificateUrl,
              });
            } else {
              formattedPt.push({
                id: pt.id,
                serviceId: pt.serviceId,
                category: pt.service.key.toLowerCase(),
                type: pt.service.key.toLowerCase(),
                certiNumber: pt.certiNumber,
                certificateUrl: pt.certificateUrl,
              });
            }
          }
          const certeficate = await this.baService.getCerteficate(
            vendorEntity.id,
          );
          vendorEntity.preferential = formattedPt;
          vendorEntity.certificate = certeficate?.certificateUrl;
        }
      }
      return vendorEntity;
    } catch (error) {
      throw error;
    }
  }

  async trackApplication(user: any): Promise<any> {
    const apps = [];
    const result = await this.workflowService.getMyApplications(user);
    for (const row of result) {
      // const business = await this.baService.getBusinessAreaByInstanceId(row.id);
      const status = row.businessArea.status;
      apps.push({
        service: row.service.name,
        key: row.service.key,
        ApplicationNumber: row.applicationNumber,
        submittedAt: row.submittedAt,
        remark: row?.businessArea?.remark,
        status: status,
      });
    }
    return apps;
  }

  async getVendorByUserWithProfile(
    userId: string,
    serviceId: string,
  ): Promise<VendorsEntity> {
    try {
      const vendorEntity = await this.vendorRepository.findOne({
        select: {
          id: true,
          ProfileInfo: { status: true, profileData: true },
          isrVendor: {
            id: true,
            businessAreas: { id: true, instanceId: true },
          },
        },
        relations: {
          ProfileInfo: true,
          isrVendor: { businessAreas: true },
        },
        where: {
          userId: userId,
          ProfileInfo: { status: ApplicationStatus.SUBMITTED },
          isrVendor: { businessAreas: { status: ApplicationStatus.PENDING } },
        },
      });
      return vendorEntity;
    } catch (error) {
      throw error;
    }
  }

  async getIsrVendors(): Promise<any[]> {
    try {
      const vendorEntity = await this.isrVendorsRepository.find();
      return vendorEntity;
    } catch (error) {
      throw error;
    }
  }
  async getVendorByIdForCertificate(isrvendorId: string) {
    const result = await this.vendorRepository.findOne({
      where: {
        isrVendorId: isrvendorId,
        isrVendor: {
          businessAreas: {
            status: In(['Approved', 'APPROVED']),
            category: In([
              BusinessCategories.GOODS,
              BusinessCategories.SERVICES,
            ]),
          },
        },
      },
      relations: {
        isrVendor: { businessAreas: { BpService: true, servicePrice: true } },
        areasOfBusinessInterest: true,
      },
    });
    return result;
  }

  async getVendors(
    user: any,
    query: CollectionQuery,
  ): Promise<DataResponseFormat<VendorInitiationResponseDto>> {
    const dataQuery = QueryConstructor.constructQuery<VendorsEntity>(
      this.vendorRepository,
      query,
    );
    dataQuery.andWhere('vendors.status=:status', {
      status: ApplicationStatus.APPROVED,
    });
    const [items, total] = await dataQuery.getManyAndCount();
    const response = new DataResponseFormat<VendorInitiationResponseDto>();
    response.items = items.map((item) =>
      VendorInitiationResponseDto.toResponse(item),
    );
    response.total = total;
    return response;
  }
  async GetMBRSData(mbrsDataDto) {
    try {
      const url = `${process.env.MBRA_URL}/${mbrsDataDto.tin}/${mbrsDataDto.issuedDate}`;
      console.log(url);
      const result = await axios.get(url);
      if (!result) return null;
      return result;
      // commented because mbrs api is not working
      // const mbrsurl = `{process.env.MBRS_URL}/${mbrsDataDto.tinNumber}/${mbrsDataDto.licenseNumber}`;
      // const mbrsResponse = await axios.get(mbrsurl);
      // if (!mbrsResponse) throw new HttpException(`not found in mbrs`, 500);
      // const mbrsData: MbrsData = new MbrsData();
      // mbrsData.businessLicenseNumber =
      //   mbrsResponse?.data?.businessLicenseNumber;
      // mbrsData.businessName = mbrsResponse?.data?.businessName;
      // mbrsData.dateRegistered = mbrsResponse?.data?.dateRegistered;
      // mbrsData.firstName = mbrsResponse?.data?.firstName;
      // mbrsData.lastName = mbrsResponse?.data?.lastName;
      // mbrsData.legalStatus = mbrsResponse?.data?.legalStatus;
      // mbrsData.middleName = mbrsResponse?.data?.middleName;
      // mbrsData.nationality = mbrsResponse?.data?.nationality;
      // mbrsData.organizationName = mbrsResponse?.data?.organizationName;
      // mbrsData.tin = mbrsResponse?.data?.tin;
      // return mbrsData;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async GetNCICData(tinNumber: string) {
    try {
      const nCICDataDto: NCICDataDto = new NCICDataDto();
      const url = `${process.env.NCIC_URL}/${tinNumber}`;
      const response = await axios.get(url);
      if (
        response?.data == null ||
        response?.data?.tin !== tinNumber.toString().trim()
      )
        return null;
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async GetFPPAData(tinNumber: string) {
    try {
      const url = `${process.env.FPPA_URL}/${tinNumber}`;
      const response = await axios.get(url);
      const fppaDataDto: FppaDataDto = new FppaDataDto();
      fppaDataDto.id = response?.data?.id;
      fppaDataDto.tin = response?.data?.tin;
      fppaDataDto.accountName = response?.data?.accountName;
      fppaDataDto.accountNo = response?.data?.accountNo;
      fppaDataDto.businessType = response?.data?.businessType;
      fppaDataDto.mobileNumber = response?.data?.mobileNumber;
      fppaDataDto.supplierCode = response?.data?.supplierCode;
      fppaDataDto.supplierName = response?.data?.supplierName;
      // return fppaDataDto;
      if (!response.data || response.data == null) return null;
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async getRenewalIsrVendor(userId: string) {
    const result = await this.isrVendorsRepository.findOne({
      where: {
        userId: userId,
        status: VendorStatusEnum.RENEWAL,
      },
    });
    if (!result) throw new NotFoundException('vendor not found');
    const data = await this.isrVendorsRepository.findOne({
      where: {
        userId: userId,
      },
    });
    data.initial.level = VendorStatusEnum.PPDA;
    data.initial.status = VendorStatusEnum.DRAFT;
    result.id = undefined;
    result.status = VendorStatusEnum.RENEWAL;
    const res = await this.isrVendorsRepository.save(result);
    // const initial = businessAreas
    return res;
  }

  async submitServiceUpgradeOrRenewal(
    file: Express.Multer.File,
    user: any,
    paymentReceiptDto: ReceiptDto,
    serviceKey: string,
  ) {
    const userId = user.id;
    try {
      const result = await this.isrVendorsRepository.findOne({
        where: { userId: userId, status: In(this.updateVendorEnums) },
      });
      if (!result) throw new NotFoundException('vendor not found ');
      const vendor = await this.vendorRepository.findOne({
        where: { userId: userId },
        select: { canRequest: true },
      });
      if (!vendor.canRequest)
        throw new NotFoundException(`profile update in progress`);
      const subDirectory = 'paymentReceipt';
      const uploadedFileName = await this.fileService.uploadDocuments(
        file,
        user,
        subDirectory,
      );
      const paymentReceipt = {
        transactionNumber: paymentReceiptDto?.transactionNumber,
        invoiceId: paymentReceiptDto?.invoiceIds,
        attachment: uploadedFileName,
      };
      result.paymentReceipt = paymentReceipt;
      result.initial.level = VendorStatusEnum.DOC;
      result.initial.status = VendorStatusEnum.SAVE;
      await this.isrVendorsRepository.save(result);
      const ids = JSON.parse(paymentReceiptDto?.invoiceIds);
      for (let index = 0; index < ids.length; index++) {
        await this.invoiceRepository.update(ids[index], {
          paymentStatus: PaymentStatus.PAID,
          attachment: uploadedFileName,
        });
      }

      const invoice = await this.invoiceRepository.findOne({
        where: {
          id: In(ids),
          service: { businessProcesses: { isActive: true } },
        },
        relations: {
          service: {
            businessProcesses: true,
          },
        },
      });
      const wfi: CreateWorkflowInstanceDto = new CreateWorkflowInstanceDto();
      // const serviceBA = invoice.service.businessAreas;
      const baCatagories = invoice.paymentDetail.map((item) => item.category);
      const businessAreas = await this.baService.getBusinessUppgradesOrRenewal(
        baCatagories,
        serviceKey,
      );
      wfi.bpId = invoice.service.businessProcesses.find(
        (item) => item.isActive == true,
      ).id;
      wfi.serviceId = invoice.serviceId;
      wfi.requestorId = result.id;
      wfi.data = result;
      const resonse = await this.workflowService.intiateWorkflowInstance(
        wfi,
        user,
      );

      for (const row of businessAreas) {
        row.instanceId = resonse.application?.id;
        row.applicationNumber = resonse.application?.applicationNumber;
        await this.baService.update(row.id, row);
      }
      return paymentReceipt;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getApprovedVendorById(vendorId: string) {
    const vendorData = await this.vendorRepository.findOne({
      where: [
        {
          id: vendorId,
          isrVendor: {
            businessAreas: {
              status: ApplicationStatus.APPROVED,
              category: In([
                BusinessCategories.GOODS,
                BusinessCategories.SERVICES,
                BusinessCategories.WORKS,
              ]),
            },
          },
        },
      ],
      select: {
        id: true,
        name: true,
        tin: true,
        formOfEntity: true,
        origin: true,
        metaData: true,
        status: true,
        userId: true,
        vendorAccounts: {
          id: true,
          accountHolderFullName: true,
          accountNumber: true,
          bankName: true,
          branchName: true,
          currency: true,
          IBAN: true,
          status: true,
          isDefualt: true,
          branchAddress: true,
        },
        shareholders: {
          id: true,
          firstName: true,
          lastName: true,
          nationality: true,
          share: true,
        },
        beneficialOwnership: {
          id: true,
          firstName: true,
          lastName: true,
          nationality: true,
        },
        areasOfBusinessInterest: {
          id: true,
          category: true,
          lineOfBusiness: true,
        },
        isrVendor: { id: true, businessAreas: true },
      },
      relations: {
        areasOfBusinessInterest: true,
        shareholders: true,
        beneficialOwnership: true,
        vendorAccounts: true,
        isrVendor: { businessAreas: { servicePrice: true, BpService: true } },
      },
    });
    if (!vendorData) throw new HttpException('Vendor not found', 404);
    const { isrVendor, ...rest } = vendorData;
    const bussinessAreas = [];
    for (const ba of vendorData.isrVendor?.businessAreas) {
      //   const business = BusinessAreaDetailResponseDto.toResponse(ba);
      let businessarea = {};
      let bl = [];
      const priceRange = this.commonService.formatPriceRange(ba.servicePrice);
      for (const lob of vendorData.areasOfBusinessInterest) {
        if (lob.category == ba.category) {
          bl = lob.lineOfBusiness.map((item: any) => item.name);
          businessarea = {
            category: ba.category,
            ValueRange: priceRange,
            lineOfBusiness: bl,
            approvedAt: ba.approvedAt,
            expireDate: ba.expireDate,
            //  certificateUrl: ba.certificateUrl,
          };
          break;
        }
      }
      bussinessAreas.push(businessarea);
    }
    rest.areasOfBusinessInterest = bussinessAreas;
    const certeficate = await this.baService.getCerteficate(vendorData.id);
    const preferentails = await this.ptService.getMyPreferetialTreatments(vendorData.userId);

    const vendor = {
      ...rest,
      certificate: certeficate?.certificateUrl,
      preferentail: [...preferentails],
    };
    return vendor;
  }
  async getRejectedVendors(user: any, query: CollectionQuery) {
    const dataQuery = QueryConstructor.constructQuery<IsrVendorsEntity>(
      this.isrVendorsRepository,
      query,
    )
      .andWhere('isr_vendors.status =:status', {
        status: ApplicationStatus.REJECTED,
      })
      .orderBy('isr_vendors.updatedAt', 'ASC');

    const d = new DataResponseFormat<IsrVendorsResponseDto>();
    const [result, total] = await dataQuery.getManyAndCount();
    d.items = result.map((entity) => {
      return IsrVendorsResponseDto.toResponse(entity);
    });
    d.total = total;
    return d;
  }

  async getRejectedApps(user: any, query: CollectionQuery) {
    const jointables = [...query.includes, 'servicePrice', 'BpService', 'isrVendor'];
    query.includes = jointables;
    query.orderBy.push({ column: 'updatedAt', direction: 'ASC' });
    const dataQuery = QueryConstructor.constructQuery<BusinessAreaEntity>(
      this.businessAreaRepository, query)
      .andWhere('business_areas.status In(:...statuses)', {
        statuses: [ApplicationStatus.REJECTED, ApplicationStatus.CANCELED]
      })
    /// .orderBy('updatedAt', 'ASC');

    const d = new DataResponseFormat<ApplicationDto>();
    const [result, total] = await dataQuery.getManyAndCount();
    d.items = result.map((entity) => {
      return ApplicationDto.toResponse(entity);
    });
    d.total = total;
    return d;
  }
  async getRejectedISRVendorById(VendorId: string): Promise<any> {
    const result = await this.isrVendorsRepository.findOne({
      where: { id: VendorId, status: ApplicationStatus.REJECTED },
      relations: {
        businessAreas: { servicePrice: true, BpService: true },
        instances: true,
      },
    });
    const vendor = {
      ...result,
      businessAreas: result.businessAreas.map((ba) => {
        const result = BusinessAreaDetailResponseDto.toResponse(ba)
        if (ba.servicePrice) {
          result.priceRange = this.commonService.formatPriceRange(ba.servicePrice);
        }
        return result;
      }

      ),
      areasOfBusinessInterest: result.areasOfBusinessInterest.map((entity) => {
        return {
          name: entity.lineOfBusiness[0].name,
          category: entity.category,
        };
      }),
    };
    return vendor;
  }

  async getApprovedVendorServiceByUserId(userId: string): Promise<any> {
    try {
      const vendorEntity = await this.vendorRepository.findOne({
        select: {
          isrVendor: { id: true, tinNumber: true, businessAreas: true },
        },
        where: {
          userId: userId,
          status: VendorStatusEnum.APPROVED,
          isrVendor: { businessAreas: { status: VendorStatusEnum.APPROVED } },
        },
        relations: {
          areasOfBusinessInterest: true,
          isrVendor: { businessAreas: { servicePrice: true } },
        },
      });
      if (!vendorEntity)
        return {
          status: {
            level: 'Info',
            status: 'Draft',
          },
          data: [],
        };
      const areaOfBusinessInterest = await this.businessAreaRepository.find({
        where: {
          vendorId: vendorEntity.id,
          status: VendorStatusEnum.APPROVED,
        },
      });
      return {
        status: areaOfBusinessInterest[0].businessAreaState,
        data: areaOfBusinessInterest.map((value, index) => ({
          id: value.id,
          areaOfBusinessInterest: vendorEntity.areasOfBusinessInterest.find(
            (element) => element.category === value.category,
          ),
        })),
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async getMyApprovedService(user: any): Promise<any> {
    try {
      // user.id = '4408fe5d-2672-4c2f-880d-4928b960e096';
      const vendorEntity = await this.vendorRepository.findOne({
        select: {
          isrVendor: { id: true, tinNumber: true, businessAreas: true },
        },
        where: {
          userId: user.id,
          status: VendorStatusEnum.APPROVED,
          isrVendor: {
            businessAreas: {
              status: VendorStatusEnum.APPROVED,
              category: In([
                BusinessCategories.GOODS,
                BusinessCategories.SERVICES,
                BusinessCategories.WORKS,
              ]),
            },
          },
        },
        relations: {
          isrVendor: { businessAreas: { servicePrice: true } },
          areasOfBusinessInterest: true,
        },
      });

      let bas = vendorEntity?.isrVendor?.businessAreas;
      if (bas.length == 0) bas = [];
      // const baInstanceIds = [];
      const baResponse = [];
      for (const row of bas) {
        //  baInstanceIds.push(row.instanceId);
        const newPR = vendorEntity.areasOfBusinessInterest.find(
          (element) => element.category === row.category,
        )
        newPR.priceRange = row.priceRangeId;
        baResponse.push({
          id: row.id,
          vendorId: row.vendorId,
          pricingId: row.priceRangeId,
          category: row.category,
          areaOfBusinessInterest: newPR
        })
      }

      return {
        status: {
          level: 'info',
        },
        data: baResponse,
      };
    } catch (error) {
      console.log(error);
    }
  }
  //new servicefor onprogress services
  async getMyOnProgressService(user: any): Promise<any> {
    try {
      // user.id = '4408fe5d-2672-4c2f-880d-4928b960e096';
      const vendorEntity = await this.vendorRepository.findOne({
        select: {
          isrVendor: { id: true, tinNumber: true, businessAreas: true },
        },
        where: {
          userId: user.id,
          status: VendorStatusEnum.APPROVED,
          isrVendor: {
            businessAreas: {
              status: VendorStatusEnum.PENDING,
              category: In(['Goods', 'Services', 'Works']),
            },
          },
        },
        relations: {
          isrVendor: { businessAreas: { servicePrice: true } },
          areasOfBusinessInterest: true,
        },
      });

      let bas = vendorEntity?.isrVendor?.businessAreas;
      if (bas.length == 0) bas = [];
      const baInstanceIds = [];
      const baResponse = [];
      for (const row of bas) {
        baInstanceIds.push(row.instanceId);
        baResponse.push({
          id: row.id,
          vendorId: row.vendorId,
          pricingId: row.priceRangeId,
          areaOfBusinessInterest: vendorEntity.areasOfBusinessInterest.find(
            (element) => element.category === row.category,
          ),
        });
      }

      return {
        status: {
          level: 'info',
          // status: selectedServices.length == 0 ? 'Draft' : 'Payment',
          // selectedPriceRange: selectedServices,
        },
        data: baResponse,
      };
    } catch (error) {
      console.log(error);
    }
  }

  async initiateVendorProfileUpdate(userId: string) {
    const isrVendor = await this.isrVendorsRepository.findOne({
      where: { userId: userId, status: VendorStatusEnum.APPROVED },
    });
    isrVendor.id = undefined;
    isrVendor.status = VendorStatusEnum.UPDATE;
    isrVendor.initial.status = VendorStatusEnum.DRAFT;
    isrVendor.initial.level = VendorStatusEnum.BASIC;
    isrVendor.areasOfBusinessInterest =
      InitialValueSchema.areasOfBusinessInterest;
    isrVendor.bankAccountDetails = InitialValueSchema.bankAccountDetails;
    isrVendor.beneficialOwnership = InitialValueSchema.beneficialOwnership;
    isrVendor.businessSizeAndOwnership =
      InitialValueSchema.businessSizeAndOwnership;
    isrVendor.contactPersons = InitialValueSchema.contactPersons;
    isrVendor.initial = InitialValueSchema.initial;
    isrVendor.address = InitialValueSchema.address;
    isrVendor.basic = InitialValueSchema.basic;
    isrVendor.shareHolders = InitialValueSchema.shareHolders;
    const result = await this.isrVendorsRepository.save(isrVendor);
    return result;
  }
  async updateVendorProfile(isrVendorId: string, data: any) {
    const isrVendor = await this.isrVendorsRepository.findOne({
      where: { id: isrVendorId },
    });
    if (
      data?.initial?.status == VendorStatusEnum.DRAFT ||
      data.initial.level !== VendorStatusEnum.SUBMIT
    ) {
      isrVendor.areasOfBusinessInterest = data?.areasOfBusinessInterest;
      isrVendor.bankAccountDetails = data?.bankAccountDetails;
      isrVendor.beneficialOwnership = data?.beneficialOwnership;
      isrVendor.businessSizeAndOwnership = data?.businessSizeAndOwnership;
      isrVendor.contactPersons = data?.contactPersons;
      isrVendor.initial = data?.initial;
      isrVendor.address = data?.address;
      isrVendor.basic = data?.basic;
      isrVendor.shareHolders = data?.shareHolders;
      return isrVendor;
    } else if (
      data?.initial?.status == VendorStatusEnum.SUBMIT &&
      data.initial.level !== VendorStatusEnum.SUBMIT
    ) {
    }
  }

  async cancelRegistration(user: any) {
    const vendor = await this.isrVendorsRepository.findOne({
      where: { userId: user.id, status: Not(ApplicationStatus.APPROVED) },
    });
    try {
      if (vendor) {
        await this.invoiceRepository.delete({
          userId: user.id,
          paymentStatus: PaymentStatus.PENDING,
        });
        await this.businessAreaRepository.delete({
          vendorId: vendor.id,
          status: VendorStatusEnum.PENDING,
        });
        await this.isrVendorsRepository.delete({
          userId: user.id,
          status: Not(VendorStatusEnum.APPROVED),
        });
        return true;
      } else {
        await this.invoiceRepository.delete({
          userId: user.id,
          paymentStatus: PaymentStatus.PENDING,
        });
        await this.businessAreaRepository.delete({
          vendorId: vendor.id,
          status: PaymentStatus.PENDING,
        });
        return true;
      }
    } catch (error) {
      throw new HttpException(
        'Unable to cancel registration request ',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async getAllBusinessAreasByUserId(userId: string) {
    const vendorEntity = await this.isrVendorsRepository.findOne({
      relations: { businessAreas: { BpService: true } },
      where: {
        userId: userId,
      },
    });
    return vendorEntity;
  }

  formatingBusinessArea(priceRanges: ServicePrice[], abis: any[]) {
    const formattedAreaOfBi = [];
    for (const price of priceRanges) {
      for (const bi of abis) {
        if (bi.priceRange == price.id) {
          const priceRange = this.commonService.formatPriceRange(price);
          const lob = bi.lineOfBusiness.map((item: any) => item.name);
          formattedAreaOfBi.push({
            category: bi.category,
            priceRange: priceRange,
            lineOfBusiness: lob,
          });
        }
      }
    }
    return formattedAreaOfBi;
  }

  async getVendorInformation(userId: string) {
    try {
      const vendor = await this.vendorRepository.findOne({
        where: { userId: userId },
        relations: {
          shareholders: true,
          areasOfBusinessInterest: true,
          beneficialOwnership: true,
          businessCats: true,
          vendorAccounts: true,
        },
      });
      if (!vendor) throw new NotFoundException('vendor not found');
      const result = await this.profileInfoRepository.findOne({
        where: {
          vendorId: vendor.id,
          status: In([VendorStatusEnum.ACTIVE, VendorStatusEnum.ADJUSTMENT]),
        },
      });
      if (result == null) {
        const vendorEntity = new IsrVendorsEntity();
        vendorEntity.areasOfBusinessInterest = vendor.areasOfBusinessInterest;
        //   vendorEntity.areasOfBusinessInterestView=
        const priceRangeIds = vendor?.areasOfBusinessInterest.map(
          (item: any) => item.priceRange,
        );
        let businessInterest = [];
        let priceRanges = [];
        if (priceRangeIds.length > 0) {
          priceRanges =
            await this.pricingService.findPriceRangeByIds(priceRangeIds);
          businessInterest = this.formatingBusinessArea(
            priceRanges,
            vendor.areasOfBusinessInterest,
          );
          vendorEntity.areasOfBusinessInterest = businessInterest;
        }
        vendorEntity.bankAccountDetails = vendor.vendorAccounts;
        vendorEntity.basic = {
          name: vendor.name,
          origin: vendor.origin,
          district: vendor.district,
          tinNumber: vendor.tin,
          businessType: vendor.formOfEntity,
        };
        vendorEntity.beneficialOwnership = vendor.beneficialOwnership;
        vendorEntity.id = vendor.id;
        vendorEntity.userId = vendor.userId;
        vendorEntity.tinNumber = vendor.tin;
        vendorEntity.status = vendor.status;
        vendorEntity.tenantId = vendor.tenantId;
        vendorEntity.shareHolders = vendor.shareholders;
        vendorEntity.address = vendor.metaData?.address;
        vendorEntity.initial = vendor.metaData?.initial;
        vendorEntity.contactPersons = vendor.metaData?.contactPersons;
        vendorEntity.invoice = vendor.metaData?.invoice;
        vendorEntity.businessSizeAndOwnership =
          vendor.metaData?.businessSizeAndOwnership;
        vendorEntity.supportingDocuments = vendor.metaData?.supportingDocuments;
        vendorEntity.paymentReceipt = vendor.metaData?.paymentReceipt;

        const ceretficate = await this.baService.getCerteficate(vendor.id);
        const preferentails = await this.ptService.getMyPreferetialTreatments(userId);

        const response = {
          ...vendorEntity,
          certificate: ceretficate?.certificateUrl,
          preferential: [...preferentails],
          areasOfBusinessInterestView: [...businessInterest],
        };
        return response;
      } else {
        return result.profileData;
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async addVendorProfileUpdate(profileData: any, userInfo: any) {
    try {
      const result = await this.vendorRepository.findOne({
        where: { userId: userInfo.id },
      });

      if (!result) throw new NotFoundException('vendor not found ');

      const updateInfoNew = await this.profileInfoRepository.findOne({
        where: { vendorId: result.id, status: VendorStatusEnum.SUBMITTED },
      });
      if (updateInfoNew !== null) {
        return { status: 'profile update is already submitted' };
      }
      const updateInfo = await this.profileInfoRepository.findOne({
        where: {
          vendorId: result.id,
          status: In([ApplicationStatus.ADJUSTMENT, ApplicationStatus.DRAFT]),
        },
      });
      let resultData = null;
      if (updateInfo == null) {
        const profileInfoEntity = new ProfileInfoEntity();
        profileInfoEntity.vendorId = result?.id;
        profileInfoEntity.status = ApplicationStatus.DRAFT;
        profileInfoEntity.profileData = profileData;
        resultData = this.profileInfoRepository.save(profileInfoEntity);
      } else {
        updateInfo.profileData = profileData;
        resultData = await this.profileInfoRepository.save(updateInfo);
      }
      return resultData;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async submitVendorProfileUpdate(profileData: any, userInfo: any) {
    try {
      const vendor = await this.vendorRepository.findOne({
        where: { userId: userInfo.id },
      });
      if (!vendor) throw new NotFoundException('vendor not found');

      const updateInfo = await this.profileInfoRepository.findOne({
        where: {
          vendorId: vendor.id,
          status: ApplicationStatus.SUBMITTED,
        },
      });
      if (updateInfo) {
        throw new BadRequestException('Already Submitted Profile Update');
      } else {
        const updateInfo = await this.profileInfoRepository.findOne({
          where: {
            vendorId: vendor.id,
            status: In([ApplicationStatus.ADJUSTMENT, ApplicationStatus.DRAFT]),
          }
        });
        if (updateInfo?.status == ApplicationStatus.ADJUSTMENT) {
          updateInfo.status = ApplicationStatus.SUBMITTED;
          updateInfo.profileData = profileData;
          const resultData = await this.profileInfoRepository.save(updateInfo);
          const response = await this.goToworkflow(userInfo, resultData);
          return response;
        } else if (updateInfo?.status == ApplicationStatus.DRAFT) {
          updateInfo.status = ApplicationStatus.SUBMITTED;
          updateInfo.profileData = profileData;
          await this.profileInfoRepository.save(updateInfo);
        } else {
          const profileInfoEntity = new ProfileInfoEntity();
          profileInfoEntity.vendorId = vendor?.id;
          profileInfoEntity.status = ApplicationStatus.SUBMITTED;
          profileInfoEntity.profileData = profileData;
          await this.profileInfoRepository.save(profileInfoEntity);
        }
        const wfi = new CreateWorkflowInstanceDto();
        wfi.user = userInfo;
        const bp = await this.bpService.findBpWithServiceByKey(
          VendorStatusEnum.PROFILE_UPDATE_KEY);
        if (!bp)
          throw new NotFoundException('bp service with this key notfound');
        wfi.bpId = bp.id;
        wfi.serviceId = bp.serviceId;
        wfi.requestorId = vendor.id;
        wfi.data = { ...profileData };
        const workflowInstance =
          await this.workflowService.intiateWorkflowInstance(wfi, userInfo);
        if (!workflowInstance)
          throw new HttpException('workflow initiation failed', 400);
        const baEntity = new BusinessAreaEntity();
        baEntity.instanceId = workflowInstance.application.id;
        baEntity.category = ServiceKeyEnum.PROFILE_UPDATE;
        baEntity.serviceId = bp.serviceId;
        baEntity.applicationNumber =
          workflowInstance.application.applicationNumber;
        baEntity.status = VendorStatusEnum.PENDING;
        baEntity.vendorId = vendor.id;
        baEntity.status = 'Pending';
        await this.businessAreaRepository.save(baEntity);
        await this.vendorRepository.update(
          { id: vendor.id },
          { canRequest: false },
        );
        return {
          applicationNumber: workflowInstance.application.applicationNumber,
          instanceNumber: workflowInstance.application.id,
          vendorId: workflowInstance.application.requestorId,
        };

      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async goToworkflow(userInfo: string, profileData: ProfileInfoEntity) {
    let workflowInstance = null;
    const response = [];
    const vendorId = profileData.vendorId;
    const businessArea = await this.businessAreaRepository.findOne({
      where: { vendorId: vendorId, status: VendorStatusEnum.ADJUSTMENT },
    });
    const dto = new GotoNextStateDto();
    dto.action = 'ISR';
    dto.data = profileData;
    dto.instanceId = businessArea.instanceId;
    workflowInstance = await this.workflowService.gotoNextStep(dto, userInfo);
    if (!workflowInstance)
      throw new HttpException(`workflow_initiation_failed`, 400);
    response.push({
      applicationNumber: workflowInstance.applicationNumber,
      instanceNumber: workflowInstance.id,
      vendorId: workflowInstance.requestorId,
      serviceId: workflowInstance.serviceId,
    });
    businessArea.status = VendorStatusEnum.PENDING;
    const ba = await this.businessAreaRepository.save(businessArea);
    if (!ba) throw new HttpException('business area update failed', 400);
    return response;
  }
  async getCertificateInformations(userId: string) {
    const result = await this.vendorRepository.findOne({
      where: {
        userId: userId,
        status: VendorStatusEnum.APPROVED,
        isrVendor: { businessAreas: { status: VendorStatusEnum.APPROVED } },
      },
      relations: { isrVendor: { businessAreas: true } },
    });
    if (result == null) return { status: 'no approved service' };
    return result.isrVendor.businessAreas;
  }
  async cancelProfiles(wfiDto: UpdateWorkflowInstanceDto) {
    const profile = await this.profileInfoRepository.findOne({ where: { vendorId: wfiDto.requestorId, status: ApplicationStatus.SUBMITTED } })
    if (profile) {
      profile.status = ApplicationStatus.CANCELED;
      await this.profileInfoRepository.update(profile.id, profile);
    }
  }
  async cancelPreferentials(wfiDto: UpdateWorkflowInstanceDto) {
    try {
      const pts = await this.ptService.getSubmittedPTByUserId(wfiDto.user.id);
      const updatePts = [];
      if (pts.length) {
        for (const pt of pts) {
          pt.status = ApplicationStatus.CANCELED;
          updatePts.push(pt);
        }
        await this.ptService.saveAll(updatePts);
      }
      return HttpStatus.OK;
    } catch (error) {
      throw new Error(error);
    }
  }

  async cancelApplication(wfi: UpdateWorkflowInstanceDto) {
    const vendor = await this.vendorRepository.findOne({
      where: { id: wfi.requestorId },
    });
    await this.cancelPreferentials(wfi);
    await this.cancelProfiles(wfi);
    if (vendor) {
      return await this.baService.cancelServiceApplication(wfi.id);

    } else {
      await this.baService.cancelServiceApplication(wfi.id);
      const tempVendor = await this.isrVendorsRepository.findOne({
        where: { id: wfi.requestorId },
      });
      tempVendor.status = ApplicationStatus.REJECTED;
      await this.isrVendorsRepository.update(wfi.requestorId, tempVendor);
      return true;
    }

  }
  async submitRegistrationRequest(user: any) {
    const data = this.isrVendorsRepository.find({ where: { userId: user.id } });
    const pdf = await PdfDocumentTemplate(data);

    return pdf;
  }
}
