import { Controller, UseGuards, Get, Body, Param, Post, Put } from "@nestjs/common";
import { ApiTags, ApiResponse, ApiOkResponse } from "@nestjs/swagger";
import { ServiceKeyEnum } from "src/modules/handling/dto/workflow-instance.enum";
import { JwtGuard, CurrentUser } from "src/shared/authorization";
import { PreferentialTreatmentsEntity } from "src/entities/preferential-treatment.entity";
import { EntityCrudController } from "src/shared/controller";
import { EntityCrudOptions } from "src/shared/types/crud-option.type";
import { CreateBusinessAreaDto, UpdateBusinessAreaDto } from "../../vendor-registration/dto/business-area.dto";
import { PreferentailTreatmentService } from "../services/preferentail-treatment.service";
import { CreatePTDto, PTResponse, UpdatePTDto } from "../dto/preferentail-treatment.dto";
const options: EntityCrudOptions = {
    createDto: CreateBusinessAreaDto,
    updateDto: UpdateBusinessAreaDto,
};
@Controller('preferentail-treatment')
@ApiTags('Preferentail Treatment')
@UseGuards(JwtGuard)
@ApiResponse({ status: 500, description: 'Internal error' })
export class PreferentailTreatmentsController extends EntityCrudController<PreferentialTreatmentsEntity>(options) {
    constructor(
        private ptService: PreferentailTreatmentService,
    ) { super(ptService) }
    @Post()
    @ApiOkResponse({ type: PTResponse })
    async create(@Body() dto: CreatePTDto) {
        return await super.create(dto);
    }

    @Put('/:id')
    @ApiOkResponse({ type: PTResponse })
    async update(@Param('id') id: string, @Body() dto: UpdatePTDto) {
        return await super.update(id, dto);
    }

    @Post('submit-preferential-treatment-request')
    @ApiOkResponse({ type: PTResponse })
    async submitApplication(@Body() dto: CreatePTDto, @CurrentUser() user) {
        return await this.ptService.submitPreferential(dto, user);
    }

    @Get('get-preferential-treatment-applications')
    async getPreferetialTretments(@CurrentUser() userInfo: any) {
        const serviceKeys = [ServiceKeyEnum.preferentialTreatment]
        return await this.ptService.getPreferetialTreatments(serviceKeys, userInfo,);
    }




}