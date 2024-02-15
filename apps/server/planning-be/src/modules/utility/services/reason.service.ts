import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { EntityCrudService } from 'src/shared/service';
import { Reason } from 'src/entities/reason.entity';
import CertificatePDF from './pdf_generator';

@Injectable()
export class ReasonService extends EntityCrudService<Reason> {
  constructor(
    @InjectRepository(Reason)
    private readonly repositoryReason: Repository<Reason>,
  ) {
    super(repositoryReason);
  }

  async create(itemData: any, req?: any): Promise<any> {
    if (req?.user?.organization) {
      itemData.organizationId = req.user.organization.id;
    }

    const reason = await this.repositoryReason.find({
      where: {
        objectId: itemData.objectId,
        type: itemData.type,
      },
    });
    await this.repositoryReason.delete(reason as any);
    const item = this.repositoryReason.create(itemData);
    await this.repositoryReason.insert(item);
    return item;
  }

  // remove previous justification reason when they became valid
  async isValid(objectId: string, type: string, organizationId: string) {
    const reason = await this.repositoryReason.find({
      where: {
        objectId,
        type,
        organizationId,
      },
    });
    if (reason) {
      await this.repositoryReason.delete(reason as any);
    }
  }
}
