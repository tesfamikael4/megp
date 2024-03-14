import { IPDC } from '@entities';
import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { ExtraCrudController } from 'src/shared/controller';
import { IPDCService } from '../services/ipdc.service';
import { CreateIPDCDto, UpdateIPDCDto } from '../dto/ipdc.dto';

const options: ExtraCrudOptions = {
  entityIdName: 'procurementInstitutionId',
  createDto: CreateIPDCDto,
  updateDto: UpdateIPDCDto,
};

@Controller('iPDCs')
@ApiTags('iPDCs')
export class IPDCController extends ExtraCrudController<IPDC>(options) {
  constructor(private readonly iPDCService: IPDCService) {
    super(iPDCService);
  }
}
