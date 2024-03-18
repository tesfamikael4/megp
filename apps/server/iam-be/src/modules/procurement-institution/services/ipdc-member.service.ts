import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { ExtraCrudService } from 'src/shared/service';
import { IPDCMember } from 'src/entities';

@Injectable()
export class IPDCMemberService extends ExtraCrudService<IPDCMember> {
  constructor(
    @InjectRepository(IPDCMember)
    private readonly ipdcMemberRepository: Repository<IPDCMember>,
  ) {
    super(ipdcMemberRepository);
  }
  async bulkCreate(itemData: any, req?: any): Promise<any> {
    if (req?.user?.organization) {
      itemData.organizationId = req.user.organization.id;
    }
    await this.ipdcMemberRepository.delete({
      ipdcId: itemData.adhocTeamId,
    });
    const item = this.ipdcMemberRepository.create(itemData);
    await this.ipdcMemberRepository.insert(item);
    return item;
  }
}
