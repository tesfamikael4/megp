import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ExtraCrudController, ExtraCrudOptions } from 'megp-shared-be';
import { POTerm } from 'src/entities';
import { POTermService } from '../services/po-term.service';
import { CreatePOTermDto, UpdatePOTermDto } from '../dtos/po-term.dto';
const options: ExtraCrudOptions = {
  entityIdName: 'purchaseOrderId',
  createDto: CreatePOTermDto,
  updateDto: UpdatePOTermDto,
};

@ApiBearerAuth()
@Controller('po-terms')
@ApiTags('POTerm')
export class POTermController extends ExtraCrudController<POTerm>(options) {
  constructor(private readonly poTermService: POTermService) {
    super(poTermService);
  }
}
