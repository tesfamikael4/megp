import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthorizationModule } from 'src/shared/authorization';
import {
  AdhocTeam,
  AdhocTeamMember,
  IPDC,
  IPDCMember,
  ProcurementDisposalUnit,
  ProcurementInstitution,
} from 'src/entities';
import { IPDCService } from './services/ipdc.service';
import { IPDCMemberService } from './services/ipdc-member.service';
import { AdhocTeamMemberService } from './services/adhoc-team-member.service';
import { ProcurementInstitutionService } from './services/procurement-institution.service';
import { ProcurementDisposalUnitService } from './services/procurement-disposal-unit.service';
import { AdhocTeamService } from './services/adhoc-team.service';
import { AdhocTeamController } from './controllers/adhoc-team.controller';
import { AdhocTeamMemberController } from './controllers/adhoc-team-member.controller';
import { IPDCController } from './controllers/ipdc.controller';
import { IPDCMemberController } from './controllers/ipdc-member.controller';
import { ProcurementDisposalUnitController } from './controllers/procurement-disposal-unit.controller';
import { ProcurementInstitutionController } from './controllers/procurement-institution.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProcurementInstitution,
      ProcurementDisposalUnit,
      IPDC,
      IPDCMember,
      AdhocTeam,
      AdhocTeamMember,
    ]),
    AuthorizationModule,
  ],

  providers: [
    AdhocTeamMemberService,
    AdhocTeamService,
    IPDCService,
    IPDCMemberService,
    ProcurementInstitutionService,
    ProcurementDisposalUnitService,
  ],

  controllers: [
    AdhocTeamController,
    AdhocTeamMemberController,
    IPDCController,
    IPDCMemberController,
    ProcurementDisposalUnitController,
    ProcurementInstitutionController,
  ],

  exports: [],
})
export class ProcurementInstitutionModule {}
