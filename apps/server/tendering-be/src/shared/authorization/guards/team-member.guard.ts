import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Type,
  Inject,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectEntityManager } from '@nestjs/typeorm';
import { Observable } from 'rxjs';
import { TeamMember } from 'src/entities/team-member.entity';
import { Tender } from 'src/entities/tender.entity';
import { TeamService } from 'src/modules/team/service/team.service';
import { TeamRoleEnum } from 'src/shared/enums/team-type.enum';
import { ENTITY_MANAGER_KEY } from 'src/shared/interceptors';
import { EntityManager } from 'typeorm';

export function GroupMemberGuard(): Type<CanActivate> {
  class GroupMemberGuardMixin implements CanActivate {
    constructor(
      private readonly teamService: TeamService,
      @Inject(REQUEST) private req: Request,
      @InjectEntityManager() private readonly entityManager: EntityManager,
    ) {}
    async canActivate(context: ExecutionContext) {
      return await this.isUserMemberOfGroup(this.req);
    }

    private async isUserMemberOfGroup(request: any): Promise<boolean> {
      const userId: any = request.user.userId;
      const lotId = request.params.lotId;

      const tender = await this.entityManager.getRepository(Tender).findOne({
        where: {
          tenderMilestones: {
            isCurrent: true,
          },
          lots: {
            id: lotId,
          },
        },
        relations: {
          tenderMilestones: true,
          bdsSubmission: true,
        },
      });

      const teamType: TeamRoleEnum =
        tender.bdsSubmission.envelopType == 'single envelop'
          ? TeamRoleEnum.FINANCIAL_EVALUATOR
          : tender.tenderMilestones[0].milestoneNum < 320
            ? TeamRoleEnum.TECHNICAL_EVALUATOR
            : TeamRoleEnum.FINANCIAL_EVALUATOR;

      // const teamType: TeamRoleEnum = await this.teamService.getTeamType(lotId);
      const exists = await this.entityManager.getRepository(TeamMember).exists({
        where: {
          team: {
            teamType: teamType,
            tender: {
              lots: {
                id: lotId,
              },
            },
            teamMembers: {
              personnelId: userId,
            },
          },
        },
      });
      return exists;
    }
  }

  return GroupMemberGuardMixin;
}
