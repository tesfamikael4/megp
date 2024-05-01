import { Controller, Get, Param, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiExtraModels, ApiResponse, ApiTags } from "@nestjs/swagger";
import { DataResponseFormat } from "src/shared/api-data";
import { AllowAnonymous } from "src/shared/authorization";
import { VendorDiscoveryService } from "../services/vendor-discovery.service";
import { decodeCollectionQuery } from "src/shared/collection-query";

@ApiBearerAuth()
@Controller('vendors')
@ApiTags('vendors')
@ApiResponse({ status: 500, description: 'Internal error' })
@ApiExtraModels(DataResponseFormat)
export class VendorDiscoveryController {
    constructor(private readonly vendorService: VendorDiscoveryService) { }
    @Get('vendor-list')
    @AllowAnonymous()
    async getVendors(@Query('q') q: string,) {
        const query = decodeCollectionQuery(q);
        return await this.vendorService.getvendors(query);
    }
    @AllowAnonymous()
    @Get('get-vendor-detail/:vendorId')
    async getVendorById(@Param('vendorId') vendorId: string) {

        return await this.vendorService.getVendorById(vendorId);
    }
    @AllowAnonymous()
    @Get('get-vendor-by-registration-number/:registrationNumber')
    async getVendorByRegistrationNumber(@Param('registrationNumber') vendorId: string) {

        return await this.vendorService.getVendorByRegistrationNumber(vendorId);
    }



}