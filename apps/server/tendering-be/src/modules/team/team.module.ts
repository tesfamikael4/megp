import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MilestonesTracker } from 'src/entities/milestones-tracker.entity';
import { TeamMember } from 'src/entities/team-member.entity';
import { Team } from 'src/entities/team.entity';
import { TeamService } from './service/team.service';
import { TeamMembersService } from './service/team-members.service';
import { MileStonesTrackerService } from './service/milestones-tracker.service';
import { TeamController } from './controller/team.controller';
import { TeamMembersController } from './controller/team-members.controller';
import { MilestonesTrackerController } from './controller/milestones-tracker.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Team, TeamMember, MilestonesTracker])],
  providers: [TeamService, TeamMembersService, MileStonesTrackerService],
  controllers: [
    TeamController,
    TeamMembersController,
    MilestonesTrackerController,
  ],
})
export class TeamModule {}
