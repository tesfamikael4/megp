import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Group } from './entity/group.entity';
import { GroupService } from './services/group.service';
import { GroupController } from './controllers/group.controller';
import { UserGroupController } from './controllers/relation-user-group.controller';
import { UserGroupBulkService } from './services/group-bulk.service';
import { UserGroup } from './entity/user-group.entity';
import { ExtraUserGroupController } from './controllers/extra-user-group.controller';
import { UserGroupRelationService } from './services/group-bulk-relation.service';

@Module({
  imports: [TypeOrmModule.forFeature([Group, UserGroup])],
  providers: [GroupService, UserGroupBulkService, UserGroupRelationService],
  controllers: [GroupController, UserGroupController, ExtraUserGroupController],
})
export class GroupModule { }
