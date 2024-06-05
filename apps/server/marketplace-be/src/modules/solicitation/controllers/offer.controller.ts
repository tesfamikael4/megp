import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  ExtraCrudOptions,
  ExtraCrudController,
  CurrentUser,
  JwtGuard,
} from 'megp-shared-be';
import { SolOfferService } from '../services/offer.service';
import { SolOffer } from 'src/entities';
import { CreateOfferDto, UpdateOferDto } from '../dtos/offer.dto';
// import { VendorGuard } from 'megp-shared-be/src/authorization/guards/vendor.guard';

const options: ExtraCrudOptions = {
  entityIdName: 'rfxProductInvitationId',
  createDto: CreateOfferDto,
  updateDto: UpdateOferDto,
};

@ApiBearerAuth()
@Controller('sol-offers')
@ApiTags('Sol Offer')
// @UseGuards(JwtGuard, VendorGuard())
export class SolOfferController extends ExtraCrudController<SolOffer>(options) {
  constructor(private readonly solOfferService: SolOfferService) {
    super(solOfferService);
  }

  @Post()
  async create(@Body() itemData: CreateOfferDto, @CurrentUser() user: any) {
    itemData.vendorId = user?.id;
    return await this.solOfferService.create(itemData, user);
  }

  @Get('my-latest-offer/:rfxProductInvitationId')
  async getLatestOfferWithOrganizationId(
    @Param('rfxProductInvitationId') rfxProductInvitationId: string,
    @CurrentUser() user: any,
  ) {
    return await this.solOfferService.getLatestOfferWithOrganizationId(
      rfxProductInvitationId,
      user,
    );
  }
}
