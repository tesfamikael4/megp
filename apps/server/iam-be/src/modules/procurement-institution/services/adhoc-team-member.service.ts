import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { AdhocTeamMember } from '@entities';
import { ExtraCrudService } from 'src/shared/service';
import {
  CollectionQuery,
  FilterOperators,
  QueryConstructor,
} from 'src/shared/collection-query';
import { DataResponseFormat } from 'src/shared/api-data';
import { AdhocTeamMemberResponseDto } from '../dto/adhoc-team-member.dto';

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

  async findAllIPDCMembers(
    entityId: string,
    query: CollectionQuery,
    req?: any,
  ) {
    query.where.push([
      {
        column: 'adhocTeamId',
        value: entityId,
        operator: FilterOperators.EqualTo,
      },
    ]);

    query.includes.push('user');
    query.includes.push('user.account');

    const dataQuery = QueryConstructor.constructQuery<AdhocTeamMember>(
      this.adhocTeamMemberRepository,
      query,
    );
    const response = new DataResponseFormat<AdhocTeamMemberResponseDto>();
    if (query.count) {
      response.total = await dataQuery.getCount();
    } else {
      const [result, total] = await dataQuery.getManyAndCount();
      response.total = total;
      response.items = AdhocTeamMemberResponseDto.toDtos(result);
    }
    return response;
  }
}
