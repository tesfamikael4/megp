import { Controller, Get, Param, Query, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ReportService } from '../services/report.service';
import { JwtGuard } from 'src/shared/authorization';
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('reports')
@ApiTags('Reports')
export class ReportController {
    constructor(
        private readonly reportService: ReportService,

    ) { }



}
