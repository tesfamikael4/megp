import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { ExtraCrudController } from 'src/shared/controller';
import { Step } from 'src/entities/step.entity';
import { DefaultStepService } from '../services/defaultStep.service';

const options: ExtraCrudOptions = {
  entityIdName: 'activityId',
};

@Controller('default-steps')
@ApiTags('default-steps')
export class DefaultStepController extends ExtraCrudController<Step>(options) {
  constructor(private readonly defaultStepService: DefaultStepService) {
    super(defaultStepService);
  }

  @Post('bulk-create')
  async bulkCreate(@Body() steps: Step[]): Promise<Step[]> {
    return this.defaultStepService.bulkCreate(steps);
  }
}
