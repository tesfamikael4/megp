import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { VendorsEntity } from 'src/entities';
import { ApplicationStatus } from 'src/modules/handling/enums/application-status.enum';
import { BusinessCategories } from 'src/modules/handling/enums/business-category.enum';
import { HandlingCommonService } from 'src/modules/handling/services/handling-common-services';
import { In, Repository } from 'typeorm';
import { BusinessAreaService } from './business-area.service';
import { CollectionQuery, QueryConstructor } from 'src/shared/collection-query';
import { DataResponseFormat } from 'src/shared/api-data';
import { VendorInitiationResponseDto } from '../dto/vendor-initiation.dto';
import { PreferentailTreatmentService } from './preferentail-treatment.service';

@Injectable()
export class VendorDiscoveryService {
  constructor(
    @InjectRepository(VendorsEntity)
    private readonly vendorRepository: Repository<VendorsEntity>,
    private readonly baService: BusinessAreaService,
    private readonly utilService: HandlingCommonService,
    private readonly ptService: PreferentailTreatmentService,
  ) { }

  async getvendors(
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
  async getVendorByRegistrationNumber(registrationNumber: string) {
    const vendorData = await this.vendorRepository.findOne({
      where:
      {
        registrationNumber: registrationNumber

      },

    });
    if (!vendorData) throw new NotFoundException();
    const response = {
      vendorId: vendorData.id,
      name: vendorData.name,
      registrationNumber: vendorData.registrationNumber,
      registrationIssuedDate: vendorData.registrationIssuedDate,
      businessRegistrationNumber: vendorData.businessRegistrationNumber,
      countryOfRegistration: vendorData.countryOfRegistration,
      status: vendorData.status,
      ...vendorData.metaData.address,

    }

    return response;
  }
  async getVendorById(vendorId: string) {
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
        tinNumber: true,
        formOfEntity: true,
        countryOfRegistration: true,
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

        beneficialOwnershipShareholders: {
          firstName: true,
          middleName: true,
          lastName: true,
          nationality: true,
          share: true,
          countryOfResidence: true,
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

        beneficialOwnershipShareholders: true,
        vendorAccounts: true,
        isrVendor: { businessAreas: { servicePrice: true, BpService: true } },
      },
    });
    const { isrVendor, ...rest } = vendorData;

    const priceRanges = vendorData.isrVendor?.businessAreas.map(
      (item) => item.servicePrice,
    );
    const bussinessAreas = this.utilService.formatBusinessArea(
      priceRanges,
      vendorData.isrVendor?.businessAreas,
    );
    const ceretficate = await this.baService.getCerteficate(vendorData.id);
    const preferentails = await this.ptService.getMyPreferentialTreatments(
      vendorData.userId,
    );
    const vendor = {
      ...rest,
      certificate: ceretficate?.certificateUrl,
      preferentail: [...preferentails],
      areasOfBusinessInterestView: [...bussinessAreas],
    };
    return vendor;
  }
}
