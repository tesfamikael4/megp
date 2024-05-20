import { Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  ExtraCrudOptions,
  ExtraCrudController,
  CurrentUser,
} from 'megp-shared-be';
import { SolOfferService } from '../services/offer.service';
import { SolOffer } from 'src/entities';
import { CreateOfferDto, UpdateOferDto } from '../dtos/offer.dto';

const options: ExtraCrudOptions = {
  entityIdName: 'rfxItemId',
  createDto: CreateOfferDto,
  updateDto: UpdateOferDto,
};

@ApiBearerAuth()
@Controller('sol-offers')
@ApiTags('Sol Offer')
export class SolOfferController extends ExtraCrudController<SolOffer>(options) {
  constructor(private readonly solOfferService: SolOfferService) {
    super(solOfferService);
  }

  @Post()
  async create(itemData: CreateOfferDto, @CurrentUser() user: any) {
    itemData.vendorId = user?.id;
    return await this.solOfferService.create(itemData, user);
  }
}
