import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  CollectionQuery,
  CurrentUser,
  ExtraCrudController,
  decodeCollectionQuery,
} from 'megp-shared-be';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { RfxProductInvitation } from 'src/entities/rfx-product-invitation.entity';
import { RfxProductInvitationService } from '../services/rfx-product-invitation.service';
import { CreateRfxBidInvitationDto } from '../dtos/rfx-bid-invitaiton.dto';

const option = {
  entityIdName: 'rfxItemId',
  createDto: CreateRfxBidInvitationDto,
};

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
  async applyOnInvtitation(@Body() itemData: any, @CurrentUser() user: any) {
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

  @Patch('accpet-invitation/:rfxInvitationId')
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
  async myRfxItems(
    @Param('rfxId') rfxId: string,
    @CurrentUser() user: any,
    @Query('q') q?: string,
  ) {
    const query = decodeCollectionQuery(q);
    return await this.rfxBidInvitationService.myRfxItems(query, rfxId, user);
  }

  @Get('my-rfx-detail/:rfxId')
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
