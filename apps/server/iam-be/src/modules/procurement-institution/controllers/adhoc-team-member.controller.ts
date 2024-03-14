import { AdhocTeamMember } from '@entities';
import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { ExtraCrudController } from 'src/shared/controller';
import {
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
  constructor(private readonly AdhocTeamMemberService: AdhocTeamMemberService) {
    super(AdhocTeamMemberService);
  }
}
