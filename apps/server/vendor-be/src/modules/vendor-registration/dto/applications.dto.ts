import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { BusinessAreaEntity } from "src/entities";

export class ApplicationDto {
    @ApiProperty()
    @IsNotEmpty()
    id: string;
    @ApiProperty()
    category: string;
    @ApiProperty()
    status: string;
    @ApiProperty()
    approvedAt: Date;
    @ApiProperty()
    expireDate: Date;
    @ApiProperty()
    serviceName: string;
    @ApiProperty()
    priceRange: string
    @ApiProperty()
    currency: string;
    @ApiProperty()
    vendor: string;
    @ApiProperty()
    businessType: string;
    @ApiProperty()
    countryOfRegistration: string;
    @ApiProperty()
    reason: string;
    @ApiProperty()
    tinNumber: string
    static toResponse(entity: BusinessAreaEntity): any {
        const response = new ApplicationDto();
        response.id = entity.id;
        response.vendor = entity.isrVendor.basic.name;
        response.tinNumber = entity.isrVendor.tinNumber;
        response.countryOfRegistration = entity.isrVendor.basic.origin;
        response.businessType = entity.isrVendor.basic.businessType
        response.serviceName = entity.BpService.name;
        response.category = entity.category;
        response.reason = entity.remark;
        response.approvedAt = entity?.approvedAt;
        response.status = entity.status;
        return response;
    }
}