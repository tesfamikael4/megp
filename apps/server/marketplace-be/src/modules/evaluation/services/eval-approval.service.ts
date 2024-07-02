import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ENTITY_MANAGER_KEY, ExtraCrudService } from 'megp-shared-be';
import { EntityManager, Repository } from 'typeorm';
import { EvalApproval, RFXItem } from 'src/entities';
import { REQUEST } from '@nestjs/core';
import axios from 'axios';

@Injectable()
export class EvalApprovalService extends ExtraCrudService<EvalApproval> {
  constructor(
    @InjectRepository(EvalApproval)
    private readonly evalApprovalRepository: Repository<EvalApproval>,
    @Inject(REQUEST) private request: Request,
  ) {
    super(evalApprovalRepository);
  }

  async createApprovalsOnSubmission(rfxId: string, organizationId: string) {
    const entityManager: EntityManager = this.request[ENTITY_MANAGER_KEY];

    const evaluationApprovers = await this.getEvaluators(organizationId);

    const evalApprovalRepo = entityManager.getRepository(EvalApproval);

    const approvals = evaluationApprovers.map((approver) => {
      return evalApprovalRepo.create({
        evaluatorId: approver.id,
        evaluatorName: approver.name,
        organizationId: approver.organizationId,
        organizationName: approver.organizationName,
        order: approver.order,
        rfxId,
      });
    });

    await entityManager.getRepository(EvalApproval).insert(approvals);
  }

  async canApprove(rfxId: string, user: any) {
    const approver = await this.evalApprovalRepository.findOne({
      where: {
        rfxId,
        evaluatorId: user.userId,
      },
      select: {
        id: true,
        isDone: true,
      },
    });

    if (!approver)
      return { canApprove: false, reason: 'User is not an evaluator' };

    if (!approver.isDone)
      return {
        canApprove: false,
        reason: 'Evaluation Approval has not been submitted',
      };

    return { canApprove: true };
  }

  async canMakeApproval(rfxId: string, user: any) {
    const entityManager: EntityManager = this.request[ENTITY_MANAGER_KEY];

    const [evalApproval] = await Promise.all([
      entityManager.getRepository(EvalApproval).findOne({
        where: {
          evaluatorId: user.userId,
          organizationId: user.organization.id,
        },

        select: {
          id: true,
          isDone: true,
          order: true,
        },
      }),
    ]);

    if (!evalApproval)
      return { canSubmit: false, reason: 'User is not an evaluator' };
    if (evalApproval.isDone)
      return {
        canSubmit: false,
        reason: 'Evaluation Approval has already been submitted',
      };

    const order = evalApproval.order;

    if (order > 1) {
      const previousResponseGiven = await entityManager
        .getRepository(EvalApproval)
        .exists({
          where: {
            organizationId: user.organization.id,
            order: order - 1,
            rfxId,
            isDone: true,
            isCurrent: true,
          },
        });

      if (!previousResponseGiven)
        return {
          canSubmit: false,
          reason: 'Previous evaluator has not submitted response',
        };
    }

    return { canSubmit: true };
  }

  async canSubmit(
    rfxId: string,
    user: any,
  ): Promise<{ canSubmit: boolean; reason?: string }> {
    const entityManager: EntityManager = this.request[ENTITY_MANAGER_KEY];

    const [rfxItems, evalApproval] = await Promise.all([
      entityManager.getRepository(RFXItem).find({
        where: {
          rfxId,
        },
        select: {
          id: true,
        },
      }),
      entityManager.getRepository(EvalApproval).findOne({
        where: {
          evaluatorId: user.userId,
          rfxId,
          isCurrent: true,
        },
        relations: {
          evalApprovalDetails: true,
        },
        select: {
          id: true,
          isDone: true,
          evalApprovalDetails: {
            id: true,
            rfxItemId: true,
          },
        },
      }),
    ]);

    if (evalApproval.isDone)
      return {
        canSubmit: false,
        reason: 'Evaluation Approval has already been submitted',
      };

    const canSubmit = rfxItems.every((item) =>
      evalApproval.evalApprovalDetails.some(
        (detail) => item.id === detail.rfxItemId,
      ),
    );

    if (!canSubmit)
      return {
        canSubmit: false,
        reason: 'Evaluation Approval for each item has not been completed',
      };

    return { canSubmit: true };
  }

  async completeRfxApproval(rfxId: string, user: any) {
    const canSubmit = await this.canSubmit(rfxId, user);
    if (!canSubmit) throw new BadRequestException(canSubmit.reason);

    await this.evalApprovalRepository.update(
      {
        evaluatorId: user.userId,
        rfxId,
        isCurrent: true,
      },
      {
        isDone: true,
      },
    );
  }

  private async getEvaluators(organizationId: string) {
    const INFRASTRUCTURE_BASE_ENDPOINT =
      process.env.PR_BASE_ENDPOINT ??
      'https://dev-bo.megp.peragosystems.com/infrastructure/api/';

    const infraResponse = await axios.get(
      `${INFRASTRUCTURE_BASE_ENDPOINT}steps/order-steps`,
      {
        headers: {
          'X-API-KEY':
            process.env.API_KEY ?? '25bc1622e5fb42cca3d3e62e90a3a20f',
        },
      },
    );

    return infraResponse.data;
  }
}
