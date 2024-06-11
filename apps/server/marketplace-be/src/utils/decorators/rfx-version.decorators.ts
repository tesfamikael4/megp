import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { ENTITY_MANAGER_KEY } from 'megp-shared-be';
import { RFX } from 'src/entities';
import { EntityManager } from 'typeorm';

export const RfxVersion = createParamDecorator(
  async (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    const entityManager: EntityManager = request[ENTITY_MANAGER_KEY];
    const rfx = await entityManager.getRepository(RFX).findOne({
      where: {
        id: request.params.rfxId,
      },
      select: {
        id: true,
        version: true,
      },
    });

    if (!rfx) throw new BadRequestException('RFQ not found');
    return rfx.version;
  },
);
