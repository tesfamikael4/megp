import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { ExtraCrudController } from 'src/shared/controller';
import { PostProcurementMechanism } from 'src/entities/post-procurement-mechanism.entity';
import { PostProcurementMechanismService } from '../services/post-procurement-mechanism.service';

const options: ExtraCrudOptions = {
  entityIdName: 'postBudgetPlanActivityId',
};

@Controller('post-procurement-mechanism')
@ApiTags('post-procurement-mechanism')
export class PostProcurementMechanismController extends ExtraCrudController<PostProcurementMechanism>(
  options,
) {
  constructor(
    private readonly postProcurementMechanismService: PostProcurementMechanismService,
  ) {
    super(postProcurementMechanismService);
  }
}
