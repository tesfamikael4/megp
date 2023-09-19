import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { ApiExtraModels, ApiResponse, ApiTags } from "@nestjs/swagger";
import { DataResponseFormat } from "src/shared/api-data";
import { VendorsBankDto } from "../dto/bank-vendor.dto";
import { BankDto } from "../dto/bank.dto";
import { ShareholderService } from "../services/shareholder.service";
import { CollectionQuery } from "src/shared/collection-query";

//@ApiBearerAuth()
@Controller('Shareholders')
@ApiTags('Shareholders')
@ApiResponse({ status: 500, description: 'Internal error' })
@ApiExtraModels(DataResponseFormat)
export class ShareholderController {
    constructor(private readonly shareholderService: ShareholderService) { }
    @Get('fetch')
    async fetch(@Query() query: CollectionQuery) {
        return await this.shareholderService.fetch(query);
    }
    @Get('get-shareholder-byId/:shareholderId')
    async getShareholderById(@Param('shareholderId') shareholderId: string) {
        return await this.shareholderService.getShareholderById(shareholderId);
    }
    @Get('get-shareholders-by-vendorId/:vendorId')
    async getShareholdersByVendorId(@Param('vendorId') vendorId: string, @Query() query: CollectionQuery) {
        return await this.shareholderService.getShareholdersByVendorId(vendorId, query);
    }

}
