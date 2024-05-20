import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import {
  CollectionQuery,
  CurrentUser,
  ExtraCrudController,
} from 'megp-shared-be';
import { ApiTags } from '@nestjs/swagger';
import { RfxBidInvitation } from 'src/entities/rfx-bid-invitation.entity';
import { RfxBidInvitationService } from '../services/rfx-bid-invitation.service';
import { CreateRfxBidInvitationDto } from '../dtos/rfx-bid-invitaiton.dto';

const option = {
  entityIdName: 'rfxItemId',
  createDto: CreateRfxBidInvitationDto,
};

@Controller('rfx-bid-invitations')
@ApiTags('Rfx Bid Invitations')
export class RfxBidInvitationController extends ExtraCrudController<RfxBidInvitation>(
  option,
) {
  constructor(
    private readonly rfxBidInvitationService: RfxBidInvitationService,
  ) {
    super(rfxBidInvitationService);
  }

  @Get('my-item-invitations/:rfxItemId')
  async myItemInvitaitons(
    @Param('rfxItemId') rfxItemId: string,
    @CurrentUser() user: any,
  ) {
    return await this.rfxBidInvitationService.myRfxItemInvitations(
      rfxItemId,
      user,
    );
  }

  @Get('my-rfx-items/:rfxId')
  async myRfxItems(@Param('rfxId') rfxId: string, @CurrentUser() user: any) {
    return await this.rfxBidInvitationService.myRfxDetail(rfxId, user);
  }

  @Get('my-invitations')
  async myInvitations(
    @Query() query: CollectionQuery,
    @CurrentUser() user: any,
  ) {
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
