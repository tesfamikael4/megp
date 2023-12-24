// import { Controller } from '@nestjs/common';
// import { ApiTags } from '@nestjs/swagger';
// import { ActivityCoATag } from 'src/entities';
// import { ActivityCoATagService } from '../services/activity-co-atag.service';
// import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
// import { ExtraCrudController } from 'src/shared/controller';

// const options: ExtraCrudOptions = {
//   entityIdName: 'postBudgetPlanActivityId',
// };

// @Controller('activity-coa-tags')
// @ApiTags('activity-coa-tags')
// export class ActivityCoATagController extends ExtraCrudController<ActivityCoATag>(
//   options,
// ) {
//   constructor(private readonly activityCoAtagService: ActivityCoATagService) {
//     super(activityCoAtagService);
//   }
// }
