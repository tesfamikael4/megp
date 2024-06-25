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
import { TeamRoleEnum } from 'src/shared/enums/team-type.enum';
import { ENTITY_MANAGER_KEY } from 'src/shared/interceptors';
import { EntityManager } from 'typeorm';

export function GroupMemberGuard(teamType: TeamRoleEnum): Type<CanActivate> {
  class GroupMemberGuardMixin implements CanActivate {
    constructor(
      @Inject(REQUEST) private req: Request,
      @InjectEntityManager() private readonly entityManager: EntityManager,
    ) {}
    async canActivate(context: ExecutionContext) {
      //   const requiredTeamTypes = teamTypes.split('|');
      //   if (requiredTeamTypes.length < 1) {
      //     return true;
      //   }

      const request = context.switchToHttp().getRequest();

      return await this.isUserMemberOfGroup(this.req);

      //   return requiredTeamTypes.some((requiredTeamType) =>
      //     requiredTeamType?.find((x: any) => x.key == requiredPermission.trim()),
      //   );
    }

    private async isUserMemberOfGroup(request: any): Promise<boolean> {
      const userId: any = request.user.userId;
      const lotId = request.params.lotId;

      const manager = this.req[ENTITY_MANAGER_KEY];
      const tender = await this.entityManager.getRepository(Tender).findOne({
        where: {
          tenderMilestones: {
            isCurrent: true,
          },
        },
        relations: {
          tenderMilestones: true,
          bdsSubmission: true,
        },
      });

      const teamType =
        tender.bdsSubmission.envelopType == 'two envelop'
          ? TeamRoleEnum.FINANCIAL_EVALUATOR
          : tender.tenderMilestones[0].milestoneNum < 320
            ? TeamRoleEnum.TECHNICAL_EVALUATOR
            : TeamRoleEnum.FINANCIAL_EVALUATOR;
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
