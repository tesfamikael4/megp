import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiExtraModels, ApiResponse, ApiTags } from "@nestjs/swagger";
import { DataResponseFormat } from "src/shared/api-data";
import { JwtGuard } from "src/shared/authorization";
import { VendorDiscoveryService } from "../services/vendor-discovery.service";

@ApiBearerAuth()
@Controller('vendors')
@ApiTags('vendors')
@ApiResponse({ status: 500, description: 'Internal error' })
@ApiExtraModels(DataResponseFormat)
export class VendorDiscoveryController {
    constructor(private readonly vendorService: VendorDiscoveryService) { }
    @Get('vendor-list')
    async getVendors() {
        return await this.vendorService.getvendors();
    }
    @UseGuards(JwtGuard)
    @Get('get-vendor-detail/:vendorId')
    async getVendorById(@Param('vendorId') vendorId: string) {
        return await this.vendorService.getVendorById(vendorId);
    }


}