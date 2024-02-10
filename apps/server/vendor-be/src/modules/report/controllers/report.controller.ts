import {
  Body,
  Controller,
  Get,
  Param,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ReportService } from '../services/report.service';
import { JwtGuard } from 'src/shared/authorization';
import { DateRange, VendorListDto } from '../dto/report.dto';
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('reports')
@ApiTags('Reports')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get('get-dashboard-report')
  async getDashboardReport() {
    return await this.reportService.getDashboardReport();
  }
  @Get('get-vendor-diversity-by-business-form')
  async getVendorDiversityByBusinessForm() {
    return await this.reportService.getVendorDiversityByBusinessForm();
  }

  @Get('get-vendor-diversity-by-location')
  async getVendorDiversityByLocation(@Body() dto: VendorListDto) {
    return await this.reportService.getVendorsByLocation(dto);
  }

  @Get('get-vendor-by-financial-class')
  async getVendorByFinancialClass(@Body() dateRange: DateRange) {
    return await this.reportService.getVendorByFinancialClass();
  }
  @Get('get-avarage-time')
  async getAvarageTime() {
    //not implemented yet
    return await this.reportService.getDashboardReport();
  }
  @Get('get-revenue')
  async getRevenue(@Body() range: DateRange) {
    return await this.reportService.getRevenue(range);
  }
  @Get('get-vendors-count-by-category')
  async getVendorsByCategory() {
    return await this.reportService.getVendorsByCategory();
  }
  @Get('get-applications')
  async getApplications() {
    //not implemented yet
    return await this.reportService.getDashboardReport();
  }
}
