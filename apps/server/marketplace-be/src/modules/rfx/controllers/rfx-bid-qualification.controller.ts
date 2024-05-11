import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RfxBidQualification } from 'src/entities';
import { ExtraCrudOptions, ExtraCrudController } from 'megp-shared-be';
import { RfxBidQualificationService } from '../services/rfx-bid-qualification.service';
import { CreateRfxBidQualificationDto } from '../dtos/rfx-qualification.dto';

const options: ExtraCrudOptions = {
  entityIdName: 'rfxId',
  createDto: CreateRfxBidQualificationDto,
};

@ApiBearerAuth()
@Controller('rfx-bid-qualifications')
@ApiTags('Rfx Bid Qualifications Controller')
export class RfxBidQualificationController extends ExtraCrudController<RfxBidQualification>(
  options,
) {
  constructor(
    private readonly rfxBidQualificationService: RfxBidQualificationService,
  ) {
    super(rfxBidQualificationService);
  }
}
