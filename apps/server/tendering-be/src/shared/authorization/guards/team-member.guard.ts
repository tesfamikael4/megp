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

      return await this.isUserMemberOfGroup(this.req, teamType);

      //   return requiredTeamTypes.some((requiredTeamType) =>
      //     requiredTeamType?.find((x: any) => x.key == requiredPermission.trim()),
      //   );
    }

    private async isUserMemberOfGroup(
      request: any,
      teamType: TeamRoleEnum,
    ): Promise<boolean> {
      const userId: any = request.user.userId;
      const lotId = request.params.lotId;

      const manager = this.req[ENTITY_MANAGER_KEY];
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
