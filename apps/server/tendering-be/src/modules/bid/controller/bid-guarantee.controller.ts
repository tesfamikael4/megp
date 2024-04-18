import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { ExtraCrudController } from 'src/shared/controller';
import { BidGuarantee } from 'src/entities/bid-guarantee.entity';
import { BidGuaranteeService } from '../service/bid-guarantee.service';
import {
  CreateBidGuaranteeDto,
  UpdateBidGuaranteeDto,
  UpdateGuaranteeStatusDto,
} from '../dto/bid-guarantee.dto';

const options: ExtraCrudOptions = {
  entityIdName: 'lotId',
  createDto: CreateBidGuaranteeDto,
  updateDto: UpdateBidGuaranteeDto,
};
@ApiBearerAuth()
@Controller('bid-guarantees')
@ApiTags('Bid Guarantee Controller')
export class BidGuaranteeController extends ExtraCrudController<BidGuarantee>(
  options,
) {
  constructor(private readonly bidGuaranteeService: BidGuaranteeService) {
    super(bidGuaranteeService);
  }

  @Put('update-status/:id')
  async updateStatus(
    @Param('id') id: string,
    @Body() status: UpdateGuaranteeStatusDto,
  ): Promise<BidGuarantee> {
    return await this.bidGuaranteeService.updateStatus(id, status);
  }

  @Get('download-document/:id')
  async downloadDocument(@Param('id') id: string) {
    return await this.bidGuaranteeService.downloadDocument(id);
  }
}
