import { Post, Body, Controller, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ExtraCrudOptions } from 'megp-shared-be';
import { ExtraCrudController } from 'megp-shared-be';
import { State } from 'src/entities/state.entity';
import { StateService } from '../services/state.service';
import { CurrentUser } from 'megp-shared-be';

const options: ExtraCrudOptions = {
  entityIdName: 'activityId',
};

@Controller('states')
@ApiTags('states')
export class StateController extends ExtraCrudController<State>(options) {
  constructor(private readonly stateService: StateService) {
    super(stateService);
  }

  // @Post()
  // async create(@Body() data: any, @CurrentUser() user): Promise<any> {
  //   this.stateService.createState(
  //     data.activityId,
  //     user.organization.id,
  //     data.itemId,
  //   );
  // }
}
