import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { AdhocTeamMember } from '@entities';
import { ExtraCrudService } from 'src/shared/service';

@Injectable()
export class AdhocTeamMemberService extends ExtraCrudService<AdhocTeamMember> {
  constructor(
    @InjectRepository(AdhocTeamMember)
    private readonly adhocTeamMemberRepository: Repository<AdhocTeamMember>,
  ) {
    super(adhocTeamMemberRepository);
  }

  async bulkCreate(itemData: any, req?: any): Promise<any> {
    if (req?.user?.organization) {
      itemData.organizationId = req.user.organization.id;
    }
    await this.adhocTeamMemberRepository.delete({
      adhocTeamId: itemData.adhocTeamId,
    });
    const item = this.adhocTeamMemberRepository.create(itemData);
    await this.adhocTeamMemberRepository.insert(item);
    return item;
  }
}
