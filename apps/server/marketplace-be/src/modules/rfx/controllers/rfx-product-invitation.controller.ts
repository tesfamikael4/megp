import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  CollectionQuery,
  CurrentUser,
  ExtraCrudController,
  JwtGuard,
  decodeCollectionQuery,
} from 'megp-shared-be';
import { ApiBody, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { RfxProductInvitation } from 'src/entities/rfx-product-invitation.entity';
import { RfxProductInvitationService } from '../services/rfx-product-invitation.service';
import {
  ApplyRfxProductInvitationDto,
  CreateRfxBidInvitationDto,
} from '../dtos/rfx-bid-invitaiton.dto';

const option = {
  entityIdName: 'rfxItemId',
  createDto: CreateRfxBidInvitationDto,
};

// @UseGuards(JwtGuard, VendorGuard())
@Controller('rfx-product-invitations')
@ApiTags('Rfx Product Invitations')
export class RfxProductInvitationController extends ExtraCrudController<RfxProductInvitation>(
  option,
) {
  constructor(
    private readonly rfxBidInvitationService: RfxProductInvitationService,
  ) {
    super(rfxBidInvitationService);
  }

  @Post('apply-on-invitation')
  @ApiBody({})
  async applyOnInvitation(
    @Body() itemData: ApplyRfxProductInvitationDto,
    @CurrentUser() user: any,
  ) {
    return await this.rfxBidInvitationService.applyOnInvitation(itemData, user);
  }

  @Patch('withdraw-invitation/:rfxInvitationId')
  async withdraw(
    @Param('rfxInvitationId') rfxInvitationId: string,
    @CurrentUser() user: any,
  ) {
    return await this.rfxBidInvitationService.withdrawInvitation(
      rfxInvitationId,
      user,
    );
  }

  @Patch('accept-invitation/:rfxInvitationId')
  async acceptInvitation(
    @Param('rfxInvitationId') rfxInvitationId: string,
    @CurrentUser() user: any,
  ) {
    return await this.rfxBidInvitationService.acceptInvitation(
      rfxInvitationId,
      user,
    );
  }

  @Get('my-rfx-invitations/:rfxId')
  @ApiQuery({
    name: 'q',
    type: String,
    description: 'Collection Query Parameter. Optional',
    required: false,
  })
  @ApiOperation({
    summary:
      'List of RFX Product Invitations for a given RFX filtered by the vendors Id with joined offers and previous awards for setting the starting price of the next round.',
  })
  async myRfxInvitations(
    @Param('rfxId') rfxId: string,
    @CurrentUser() user: any,
    @Query('q') q?: string,
  ) {
    const query = decodeCollectionQuery(q);
    return await this.rfxBidInvitationService.myRfxInvitations(
      rfxId,
      query,
      user,
    );
  }

  @Get('my-item-invitations/:rfxItemId')
  @ApiQuery({
    name: 'q',
    type: String,
    description: 'Collection Query Parameter. Optional',
    required: false,
  })
  @ApiOperation({
    summary:
      'List of RFX Product Invitations for a given RFX filtered by the vendors Id',
  })
  async myItemInvitations(
    @Param('rfxItemId') rfxItemId: string,
    @CurrentUser() user: any,
    @Query('q') q?: string,
  ) {
    const query = decodeCollectionQuery(q);
    return await this.rfxBidInvitationService.myItemInvitations(
      query,
      rfxItemId,
      user,
    );
  }

  @Get('my-item-detail/:rfxItemId')
  @ApiOperation({
    summary: 'RFX Item detail',
  })
  async myItemDetails(
    @Param('rfxItemId') rfxItemId: string,
    @CurrentUser() user: any,
  ) {
    return await this.rfxBidInvitationService.myRfxItemDetail(rfxItemId, user);
  }

  @Get('my-rfx-items/:rfxId')
  @ApiQuery({
    name: 'q',
    type: String,
    description: 'Collection Query Parameter. Optional',
    required: false,
  })
  @ApiOperation({
    summary:
      'List of items for a given RFX. Includes previousCount attribute to check if the user has already submitted an item for the RFX in the previous round',
  })
  async myRfxItems(
    @Param('rfxId') rfxId: string,
    @CurrentUser() user: any,
    @Query('q') q?: string,
  ) {
    const query = decodeCollectionQuery(q);
    return await this.rfxBidInvitationService.myRfxItems(query, rfxId, user);
  }

  @Get('my-rfx-detail/:rfxId')
  @ApiOperation({
    summary: 'Selected RFX with procedure and rounds for dashboard',
  })
  async myRfxDetails(@Param('rfxId') rfxId: string, @CurrentUser() user: any) {
    return await this.rfxBidInvitationService.myRfxDetail(rfxId, user);
  }

  @Get('my-invitations')
  @ApiQuery({
    name: 'q',
    type: String,
    description: 'Collection Query Parameter. Optional',
    required: false,
  })
  @ApiOperation({
    summary:
      'List of approved RFXes for a vendor. This list is filtered by product invitation"s vendor id',
  })
  async myInvitations(@CurrentUser() user: any, @Query('q') q?: string) {
    const query = decodeCollectionQuery(q);
    return await this.rfxBidInvitationService.myInvitations(query, user);
  }

  @Post('invite-selected/:rfxItemId')
  async inviteSelected(
    @Param('rfxItemId') rfxItemId: string,
    @Body() createRfxBidInvitationDto: CreateRfxBidInvitationDto,
  ) {
    return await this.rfxBidInvitationService.inviteSelected(
      rfxItemId,
      createRfxBidInvitationDto,
    );
  }

  @Post('remove-invitees/:rfxItemId')
  async removeInvitees(@Param('rfxItemId') rfxItemId: string) {
    return await this.rfxBidInvitationService.removeInvitees(rfxItemId);
  }

  @Post('make-open-invitation/:rfxItemId')
  async makeOpenInvitation(@Param('rfxItemId') rfxItemId: string) {
    return await this.rfxBidInvitationService.makeOpenInvitation(rfxItemId);
  }
}
