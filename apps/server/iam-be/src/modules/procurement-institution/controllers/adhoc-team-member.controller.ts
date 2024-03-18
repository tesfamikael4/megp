import { AdhocTeamMember } from '@entities';
import { Body, Controller, Post, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { ExtraCrudController } from 'src/shared/controller';
import {
  BulkAdhocTeamMemberDto,
  CreateAdhocTeamMemberDto,
  UpdateAdhocTeamMemberDto,
} from '../dto/adhoc-team-member.dto';
import { AdhocTeamMemberService } from '../services/adhoc-team-member.service';

const options: ExtraCrudOptions = {
  entityIdName: 'procurementInstitutionId',
  createDto: CreateAdhocTeamMemberDto,
  updateDto: UpdateAdhocTeamMemberDto,
};

@Controller('adhoc-team-member')
@ApiTags('adhoc-team-member')
export class AdhocTeamMemberController extends ExtraCrudController<AdhocTeamMember>(
  options,
) {
  constructor(private readonly adhocTeamMemberService: AdhocTeamMemberService) {
    super(adhocTeamMemberService);
  }

  @Post('bulk-create')
  async bulkCreate(
    @Body() members: BulkAdhocTeamMemberDto,
    @Req() req: any,
  ): Promise<BulkAdhocTeamMemberDto> {
    return this.adhocTeamMemberService.bulkCreate(members, req);
  }
}
