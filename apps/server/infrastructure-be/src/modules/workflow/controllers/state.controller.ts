import { Post, Body, Controller, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { ExtraCrudController } from 'src/shared/controller';
import { State } from 'src/entities/state.entity';
import { StateService } from '../services/state.service';
import { CurrentUser } from 'src/shared/authorization';

const options: ExtraCrudOptions = {
  entityIdName: 'activityId',
};

@Controller('states')
@ApiTags('states')
export class StateController extends ExtraCrudController<State>(options) {
  constructor(private readonly stateService: StateService) {
    super(stateService);
  }

  @Post(':activityId')
  async create(
    @Param('activityId') activityId: any,
    @CurrentUser() user,
  ): Promise<any> {
    this.stateService.createState(activityId, user.organization.id);
  }
}
