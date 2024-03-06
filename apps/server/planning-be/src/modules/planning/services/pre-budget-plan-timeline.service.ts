import { InjectRepository } from '@nestjs/typeorm';
import { HttpException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import {
  APP,
  PreBudgetPlanActivity,
  PreBudgetPlanTimeline,
} from 'src/entities';
import { ExtraCrudService } from 'src/shared/service';
import { BulkTimelineDto } from '../dtos/pre-budget-plan-timeline.dto';

@Injectable()
export class PreBudgetPlanTimelineService extends ExtraCrudService<PreBudgetPlanTimeline> {
  constructor(
    @InjectRepository(PreBudgetPlanTimeline)
    private readonly repositoryPreBudgetPlanTimeline: Repository<PreBudgetPlanTimeline>,
    @InjectRepository(PreBudgetPlanActivity)
    private readonly repositoryPreBudgetPlanActivity: Repository<PreBudgetPlanActivity>,
    @InjectRepository(APP)
    private readonly repositoryAPP: Repository<APP>,
  ) {
    super(repositoryPreBudgetPlanTimeline);
  }

  async getByActivityId(activityId) {
    return this.repositoryPreBudgetPlanTimeline.find({
      where: {
        preBudgetPlanActivityId: activityId,
      },
    });
  }

  async bulkCreate(
    timelines: BulkTimelineDto,
    req: any,
  ): Promise<BulkTimelineDto> {
    try {
      const organizationId = req?.user?.organization?.id;
      await this.repositoryPreBudgetPlanTimeline.delete({
        preBudgetPlanActivityId: timelines.timeline[0].preBudgetPlanActivityId,
        organizationId: organizationId,
      });

      const postBudgetPlanActivity =
        await this.repositoryPreBudgetPlanActivity.findOne({
          where: {
            id: timelines.timeline[0].preBudgetPlanActivityId,
          },
          relations: {
            preBudgetPlan: {
              app: { budgetYears: true },
            },
          },
          select: {
            id: true,
            preBudgetPlan: {
              id: true,
              app: {
                id: true,
                budgetYears: { endDate: true, startDate: true },
              },
            },
          },
        });
      const budgetPlanEndDate =
        postBudgetPlanActivity.preBudgetPlan.app.budgetYears.endDate;

      const budgetPlanStartDate =
        postBudgetPlanActivity.preBudgetPlan.app.budgetYears.startDate;

      timelines.timeline.forEach((element) => {
        element.organizationId = organizationId;
      });

      const ordered = timelines.timeline.sort((a, b) => a.order - b.order);

      if (
        new Date(ordered[0].dueDate).getTime() <= budgetPlanStartDate.getTime()
      )
        throw new HttpException(
          'Start date must be greater than budget plan start date',
          430,
        );

      if (
        new Date(ordered[ordered.length - 1].dueDate).getTime() >=
        budgetPlanEndDate.getTime()
      )
        throw new HttpException(
          'End date must be less than budget plan end date',
          430,
        );

      ordered.forEach((tl, index) => {
        const dueDate = new Date(tl.dueDate);

        if (index < ordered.length - 1) {
          if (index !== tl.order)
            throw new HttpException('Timeline order must be sequential', 430);

          const nextDueDate = new Date(ordered[index + 1].dueDate);

          // Assumed next due date is the current due date plus the next activity's period in days
          const assumedNextDueDate = dueDate;
          assumedNextDueDate.setDate(
            assumedNextDueDate.getDate() + Number(ordered[index + 1].period),
          );

          if (assumedNextDueDate.getTime() !== nextDueDate.getTime())
            throw new HttpException(
              'Timeline validation error. Due dates must be sequential with correct period difference',
              430,
            );
        }
      });

      const timeline = this.repositoryPreBudgetPlanTimeline.create(
        timelines.timeline as any,
      );
      await this.repositoryPreBudgetPlanTimeline.insert(timeline);
      return timelines;
    } catch (error) {
      throw error;
    }
  }
}
