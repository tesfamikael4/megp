import { Controller } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DataResponseFormat } from 'src/shared/api-data';
import { EntityCrudOptions } from 'src/shared/types/crud-option.type';
import { EntityCrudController } from 'src/shared/controller';
import { TargetGroupService } from '../service/target-group.service';
import { TargetGroup } from 'src/entities/target-group.entity';
import {
  CreateTargetGroupDto,
  UpdateTargetGroupDto,
} from '../dto/target-group.dto';
const options: EntityCrudOptions = {
  createDto: CreateTargetGroupDto,
  updateDto: UpdateTargetGroupDto,
};
@Controller('Target-groups')
@ApiTags(' target group')
@ApiResponse({ status: 500, description: 'Internal error' })
@ApiExtraModels(DataResponseFormat)
export class TargetGroupController extends EntityCrudController<TargetGroup>(
  options,
) {
  constructor(private readonly targetGroupService: TargetGroupService) {
    super(targetGroupService);
  }
}
