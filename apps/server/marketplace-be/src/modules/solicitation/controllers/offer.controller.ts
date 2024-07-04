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
import { CreateOfferDto, UpdateOfferDto } from '../dtos/offer.dto';

const options: ExtraCrudOptions = {
  entityIdName: 'rfxProductInvitationId',
  createDto: CreateOfferDto,
  updateDto: UpdateOfferDto,
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
    itemData.vendorId = user?.organization.id;
    return await this.solOfferService.create(itemData, user);
  }

  @Get('vendors-offer/:solRegistrationId')
  async getVendorsOffer(@Param('solRegistrationId') solRegistrationId: string) {
    return await this.solOfferService.getVendorsSolicitationOffer(
      solRegistrationId,
    );
  }

  @Get('my-latest-offer/:rfxProductInvitationId/:rfxId')
  async getLatestOfferWithOrganizationId(
    @Param('rfxProductInvitationId') rfxProductInvitationId: string,
    @Param('rfxId') rfxId: string,
    @CurrentUser() user: any,
  ) {
    return await this.solOfferService.getLatestOfferWithOrganizationId(
      rfxProductInvitationId,
      rfxId,
      user,
    );
  }
}
