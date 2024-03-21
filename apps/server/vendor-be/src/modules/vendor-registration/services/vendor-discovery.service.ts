import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { VendorsEntity } from "src/entities";
import { ApplicationStatus } from "src/modules/handling/enums/application-status.enum";
import { BusinessCategories } from "src/modules/handling/enums/business-category.enum";
import { HandlingCommonService } from "src/modules/handling/services/handling-common-services";
import { In, Repository } from "typeorm";
import { BusinessAreaService } from "./business-area.service";

@Injectable()
export class VendorDiscoveryService {
    constructor(
        @InjectRepository(VendorsEntity)
        private readonly vendorRepository: Repository<VendorsEntity>,
        private readonly baService: BusinessAreaService,
        private readonly utilService: HandlingCommonService

    ) {

    }

    async getvendors() {
        const vendorlist = await this.vendorRepository.find({ where: { status: ApplicationStatus.APPROVED } });
        return vendorlist;
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
                // { id: vendorId },
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
                    firstName: true,
                    lastName: true,
                    nationality: true,
                    share: true,
                },
                beneficialOwnership: {
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
                // preferentials: true,
            },
        });
        const { isrVendor, ...rest } = vendorData;

        const priceRanges = vendorData.isrVendor?.businessAreas.map(((item) => item.servicePrice))
        const bussinessAreas = this.utilService.formatingBusinessArea(priceRanges, vendorData.isrVendor?.businessAreas)
        /*
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
                                certificateUrl: ba.certificateUrl,
                            };
                            break;
                        }
                    }
                    bussinessAreas.push(businessarea);
                }
    */
        const ceretficate = await this.baService.getCerteficate(vendorData.id);
        const preferentails = await this.baService.getPreferentials(vendorData.id);

        // rest.areasOfBusinessInterest = bussinessAreas;
        const vendor = {
            ...rest,
            certificate: ceretficate?.certificateUrl,
            preferentail: [...preferentails],
            areasOfBusinessInterestView: [...bussinessAreas]
        };
        return vendor;
    }



}