import { InjectRepository } from '@nestjs/typeorm';
import { HttpException, Injectable, Post } from '@nestjs/common';
import { Repository } from 'typeorm';
import { PostBudgetPlanActivity, PostBudgetPlanTimeline } from 'src/entities';
import { ExtraCrudService } from 'src/shared/service';
import { BulkTimelineDto } from '../dtos/post-budget-plan-timeline.dto';

@Injectable()
export class PostBudgetPlanTimelineService extends ExtraCrudService<PostBudgetPlanTimeline> {
  constructor(
    @InjectRepository(PostBudgetPlanTimeline)
    private readonly repositoryPostBudgetPlanTimeline: Repository<PostBudgetPlanTimeline>,
    @InjectRepository(PostBudgetPlanActivity)
    private readonly repositoryPostBudgetPlanActivity: Repository<PostBudgetPlanActivity>,
  ) {
    super(repositoryPostBudgetPlanTimeline);
  }

  async bulkCreate(
    timelines: BulkTimelineDto,
    req: any,
  ): Promise<BulkTimelineDto> {
    try {
      const organizationId = req?.user?.organization?.id;
      await this.repositoryPostBudgetPlanTimeline.delete({
        postBudgetPlanActivityId:
          timelines.timeline[0].postBudgetPlanActivityId,
        organizationId: organizationId,
      });

      const postBudgetPlanActivity =
        await this.repositoryPostBudgetPlanActivity.findOne({
          where: {
            id: timelines.timeline[0].postBudgetPlanActivityId,
          },
          relations: {
            postBudgetPlan: {
              app: { budgetYears: true },
            },
          },
          select: {
            id: true,
            postBudgetPlan: {
              id: true,
              app: {
                id: true,
                budgetYears: { endDate: true, startDate: true },
              },
            },
          },
        });
      const budgetPlanEndDate =
        postBudgetPlanActivity.postBudgetPlan.app.budgetYears.endDate;

      const budgetPlanStartDate =
        postBudgetPlanActivity.postBudgetPlan.app.budgetYears.startDate;

      timelines.timeline.forEach((element) => {
        element.organizationId = organizationId;
      });

      const ordered = timelines.timeline.sort((a, b) => a.order - b.order);

      if (
        new Date(ordered[0].dueDate).getTime() < budgetPlanStartDate.getTime()
      )
        throw new HttpException(
          'Start date must be greater than budget plan start date',
          430,
        );

      if (
        new Date(ordered[ordered.length - 1].dueDate).getTime() >
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

      const timeline = this.repositoryPostBudgetPlanTimeline.create(
        timelines.timeline as any,
      );
      await this.repositoryPostBudgetPlanTimeline.insert(timeline);
      return timelines;
    } catch (error) {
      throw error;
    }
  }
}
