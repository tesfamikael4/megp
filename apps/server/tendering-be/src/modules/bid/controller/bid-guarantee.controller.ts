import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { ExtraCrudController } from 'src/shared/controller';
import { BidGuarantee } from 'src/entities/bid-guarantee.entity';
import { BidGuaranteeService } from '../service/bid-guarantee.service';
import {
  CreateBidGuaranteeDto,
  UpdateBidGuaranteeDto,
  UpdateGuaranteeStatusDto,
} from '../dto/bid-guarantee.dto';
import { decodeCollectionQuery } from 'src/shared/collection-query';
import { IgnoreTenantInterceptor } from 'src/shared/decorators/ignore-tenant-interceptor.decorator';

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

  @Get('fetch-bid-guarantees')
  @ApiQuery({
    name: 'q',
    type: String,
    description: 'Collection Query Parameter. Optional',
    required: false,
  })
  @IgnoreTenantInterceptor()
  async getBidGuarantees(@Query('q') q: string, @Req() req?: any) {
    const query = decodeCollectionQuery(q);
    return await this.bidGuaranteeService.getBidGuaranteesByGuarantorId(
      query,
      req,
    );
  }

  @Get('can-create/:lotId')
  async canCreate(@Param('lotId') lotId: string): Promise<boolean> {
    try {
      const canCreateRequest = await this.bidGuaranteeService.canCreate(lotId);
      return canCreateRequest;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get('download-document/:id')
  async downloadDocument(@Param('id') id: string) {
    return await this.bidGuaranteeService.downloadDocument(id);
  }
}
