import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { VendorsEntity, WorkflowInstanceEntity } from "src/entities";
import { LessThanOrEqual, MoreThanOrEqual, Repository } from "typeorm";
import { DateRange } from "../dto/report.dto";

@Injectable()
export class ReportService {
    constructor(@InjectRepository(WorkflowInstanceEntity)
    private readonly wfiRepository: Repository<WorkflowInstanceEntity>,
        @InjectRepository(VendorsEntity)
        private readonly vendorRepositoty: Repository<VendorsEntity>
    ) {

    }
    ///Not ompleted yet
    async getApplicationsByStatus(dateRange: DateRange): Promise<WorkflowInstanceEntity[]> {
        return await this.wfiRepository.find({
            select: { serviceId: true },
            relations: { isrVendor: { businessAreas: true }, service: true },
            where: { submittedAt: MoreThanOrEqual(dateRange.fromDate), updatedAt: LessThanOrEqual(dateRange.toDate) },
        })

    }

    async getVendorsByLocation(locationSpan: string): Promise<VendorsEntity[]> {
        let groupBy = {}
        if (locationSpan == 'district') {
            groupBy = { country: true }
        } else
            if (locationSpan == 'Country') {
                groupBy = { country: true }
            }
        return await this.vendorRepositoty.find({
            select: { country: true, district: true },
            where: { ...groupBy }
        })
    }











}