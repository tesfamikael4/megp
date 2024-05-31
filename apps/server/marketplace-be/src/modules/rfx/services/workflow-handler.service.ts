import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import {
  RFX,
  RFXItem,
  RfxBidProcedure,
  RfxProductInvitation,
  SolRound,
} from 'src/entities';
import { OpenerSerivice } from 'src/modules/evaluation/services/opener.service';
import { CreateRoundDto } from 'src/modules/solicitation/dtos/round.dto';
import { ERfxStatus, ESolRoundStatus } from 'src/utils/enums';
import { SchedulerService } from 'src/utils/services/scheduler.service';
import { DataSource, EntityManager, In } from 'typeorm';

@Injectable()
export class WorkflowHandlerService {
  constructor(
    private dataSource: DataSource,
    private readonly amqpConnection: AmqpConnection,
    private readonly schedulerService: SchedulerService,
    private readonly openerService: OpenerSerivice,
  ) {}

  emitEvent(exchange: string, routingKey: string, payload: any) {
    this.amqpConnection.publish(exchange, routingKey, payload);
  }

  async handleWorkflowResponse(payload: any) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      queryRunner.manager.connection.transaction(async (entityManager) => {
        const rfxRepo = entityManager.getRepository(RFX);
        const rfxProcedureRepo = entityManager.getRepository(RfxBidProcedure);

        const rfx = await rfxRepo.findOne({
          where: {
            id: payload.itemId,
            status: ERfxStatus.SUBMITTED,
          },
          relations: {
            rfxBidProcedure: true,
          },
        });

        if (!rfx) return Logger.error(`RFX ${payload?.itemId} not found`);

        const status = payload.status == 'Approved' ? 'APPROVED' : 'REJECTED';

        await this.updateRfxChildrenStatus(rfx.id, status, entityManager);
        await rfxProcedureRepo.update(
          {
            id: rfx.rfxBidProcedure.id,
          },
          {
            invitationDate: new Date(Date.now()),
          },
        );

        if (rfx.isOpen) {
          const approvePayload = {
            ...rfx,
            objectType: 'RFX',
          };
          this.emitEvent('rms', 'record-notice', approvePayload);
        }

        if (status == 'APPROVED') {
          await this.createZeroSolicitationRound(
            rfx.rfxBidProcedure,
            entityManager,
          );
          this.scheduleRoundOpening(rfx.id, 0, entityManager);
        }
      });
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.log(error);
    } finally {
      await queryRunner.release();
    }
  }

  async createZeroSolicitationRound(
    rfxBidProcedure: RfxBidProcedure,
    entityManager: EntityManager,
  ) {
    const roundRepo = entityManager.getRepository(SolRound);

    const start = rfxBidProcedure.invitationDate || new Date(Date.now());
    const end = rfxBidProcedure.submissionDeadline;

    const roundItem: CreateRoundDto = {
      rfxId: rfxBidProcedure.rfxId,
      round: 0,
      end,
      start,
      status: ESolRoundStatus.STARTED,
    };
    const round = roundRepo.create(roundItem);
    await roundRepo.insert(round);
    return round;
  }

  async updateRfxChildrenStatus(
    rfxId: string,
    status: any,
    entityManager: EntityManager,
  ) {
    const [, , rfxItems] = await Promise.all([
      entityManager.getRepository(RFX).update(rfxId, {
        status,
      }),
      entityManager.getRepository(RFXItem).update(
        { rfxId },
        {
          status,
        },
      ),
      entityManager.getRepository(RFXItem).find({
        where: {
          rfxId: rfxId,
        },
        select: {
          id: true,
        },
      }),
    ]);

    const rfxItemIds = rfxItems.map((item) => item.id);

    await entityManager.getRepository(RfxProductInvitation).update(
      {
        rfxItemId: In(rfxItemIds),
      },
      {
        status,
      },
    );
  }

  async scheduleRoundOpening(
    rfxId: string,
    roundNumber: number,
    entityManager: EntityManager,
  ) {
    try {
      const roundRepo = entityManager.getRepository(SolRound);
      const round = await roundRepo.findOne({
        where: {
          rfxId,
          round: roundNumber,
        },
      });

      if (!round)
        throw new BadRequestException(
          `Round ${roundNumber} for rfx with id ${rfxId} is not found`,
        );

      const payload = {
        round: roundNumber,
        rfxId,
      };

      await this.schedulerService.scheduleWithEncryption(
        this.openerService.openAndEvaluateResponses,
        round.end,
        payload,
      );
    } catch (error) {
      console.log(error);
    }
  }
}
