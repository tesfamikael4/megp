import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CollectionQuery,
  DataResponseFormat,
  ExtraCrudService,
  FilterOperators,
  QueryConstructor,
} from 'megp-shared-be';
import { RFX, SolRegistration, TeamMember } from 'src/entities';
import { Repository } from 'typeorm';
import { CreateTeamMemberDto } from '../dtos/team-member.dto';
import { ERfxStatus, ESolBookmarkStatus } from 'src/utils/enums';

@Injectable()
export class TeamMemberService extends ExtraCrudService<TeamMember> {
  constructor(
    @InjectRepository(TeamMember)
    private readonly teamMemberRepository: Repository<TeamMember>,
    @InjectRepository(RFX)
    private readonly rfxRepository: Repository<RFX>,
    @InjectRepository(SolRegistration)
    private readonly solRegistrationRepository: Repository<SolRegistration>,
  ) {
    super(teamMemberRepository);
  }

  async isTeamLead(rfxId: string, user: any) {
    return await this.teamMemberRepository.exists({
      where: {
        isTeamLead: true,
        rfxId,
        personnelId: user.userId,
      },
    });
  }
  async create(itemData: CreateTeamMemberDto, req?: any): Promise<any> {
    const [rfx, teamMemberCount] = await Promise.all([
      this.rfxRepository.exists({ where: { id: itemData.rfxId } }),
      this.teamMemberRepository.count({ where: { rfxId: itemData.rfxId } }),
    ]);

    if (!rfx) throw new Error('RFQ Not Found');

    if (itemData.members.length + teamMemberCount > 3)
      throw new Error(
        'Team Member Limit Exceeded: Maximum number allowed team members for a given RFQs is 3',
      );

    const members = itemData.members.map((item: any) => {
      item.rfxId = itemData.rfxId;
      item.organizationId = req.user.organization.id;
      item.organizationName = req.user.organization.name;
      return item;
    });

    const item = this.teamMemberRepository.create(members);
    await this.teamMemberRepository.insert(item);
    return item;
  }

  async getMyEvaluationList(query: CollectionQuery, user: any) {
    const dataQuery = QueryConstructor.constructQuery<RFX>(
      this.rfxRepository,
      query,
    )
      .leftJoin('rfxes.teamMembers', 'teamMember')
      .where('teamMember.hasEvaluated = :hasEvaluated', { hasEvaluated: false })
      .andWhere('teamMember.personnelId = :personnelId', {
        personnelId: user.userId,
      });

    const response = new DataResponseFormat<RFX>();
    if (query.count) {
      response.total = await dataQuery.getCount();
    } else {
      const [result, total] = await dataQuery.getManyAndCount();
      response.total = total;
      response.items = result;
    }
    return response;
  }

  async vendorsList(
    rfxId: string,
    isTeamAssessment: boolean,
    user: any,
    query: CollectionQuery,
  ) {
    const teamMember = await this.teamMemberRepository.findOne({
      where: {
        rfxId,
        personnelId: user.userId,
      },
      select: {
        id: true,
      },
    });
    const dataQuery = QueryConstructor.constructQuery<SolRegistration>(
      this.solRegistrationRepository,
      query,
    );

    dataQuery
      .andWhere('sol_registrations.rfxId = :rfxId', {
        rfxId,
      })
      .andWhere('sol_registrations.status = :status', {
        status: ESolBookmarkStatus.REGISTERED,
      })

      .loadRelationCountAndMap(
        'sol_registrations.isEvaluationCompleted',
        'sol_registrations.evaluationAssessments',
        'evaluationAssessment',
        (qb) =>
          qb
            .where(
              'evaluationAssessment.isTeamAssessment = :isTeamAssessment',
              {
                isTeamAssessment,
              },
            )
            .andWhere('evaluationAssessment.teamMemberId = :teamMemberId', {
              teamMemberId: teamMember.id,
            }),
      );

    const response = new DataResponseFormat<SolRegistration>();
    if (query.count) {
      response.total = await dataQuery.getCount();
    } else {
      const [result, total] = await dataQuery.getManyAndCount();

      response.total = total;
      response.items = result;
    }
    return response;
  }
}
