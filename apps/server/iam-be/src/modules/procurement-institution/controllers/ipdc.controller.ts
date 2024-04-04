import { IPDC } from '@entities';
import { Body, Controller, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { ExtraCrudController } from 'src/shared/controller';
import { IPDCService } from '../services/ipdc.service';
import {
  CreateIPDCDto,
  IPDCTeamChangeStatusDto,
  UpdateIPDCDto,
} from '../dto/ipdc.dto';

const options: ExtraCrudOptions = {
  entityIdName: 'procurementInstitutionId',
  createDto: CreateIPDCDto,
  updateDto: UpdateIPDCDto,
};

@Controller('ipdc')
@ApiTags('ipdc')
export class IPDCController extends ExtraCrudController<IPDC>(options) {
  constructor(private readonly iPDCService: IPDCService) {
    super(iPDCService);
  }
  @Put('change-status')
  async changeStatus(@Body() data: IPDCTeamChangeStatusDto) {
    return await this.iPDCService.changeStatus(data);
  }
}
