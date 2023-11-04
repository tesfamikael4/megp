import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Group, UserGroup } from '@entities';
import { GroupService } from './services/group.service';
import { GroupController } from './controllers/group.controller';
import { UserGroupService } from './services/user-group.service';
import { UserGroupNewController } from './controllers/user-group.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Group, UserGroup])],
  providers: [GroupService, UserGroupService],
  controllers: [GroupController, UserGroupNewController],
})
export class GroupModule {}
