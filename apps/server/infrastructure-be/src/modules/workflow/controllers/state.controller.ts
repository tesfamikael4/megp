import { Post, Body, Controller, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { State } from 'src/entities/state.entity';
import { StateService } from '../services/state.service';
import {
  ExtraCrudOptions,
  ExtraCrudController,
  CurrentUser,
} from '@megp/shared-be';

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
