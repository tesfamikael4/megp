import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RfxBidProcedure } from 'src/entities';
import { ExtraCrudOptions, ExtraCrudController } from 'megp-shared-be';
import { RfxBidProcedureService } from '../services/rfx-bid-procedure.service';
import {
  CreateRfxBidProcedureDTO,
  UpdateRfxBidProcedureDTO,
} from '../dtos/rfx-bid-procedure.dto';

const options: ExtraCrudOptions = {
  entityIdName: 'rfxId',
  createDto: CreateRfxBidProcedureDTO,
  updateDto: UpdateRfxBidProcedureDTO,
};

@ApiBearerAuth()
@Controller('rfx-bid-procedures')
@ApiTags('Rfx Bid Procedures Controller')
export class RfxBidProcedureController extends ExtraCrudController<RfxBidProcedure>(
  options,
) {
  constructor(private readonly rfxBidProcedureService: RfxBidProcedureService) {
    super(rfxBidProcedureService);
  }
}
