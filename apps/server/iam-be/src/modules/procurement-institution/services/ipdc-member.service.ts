import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { ExtraCrudService } from 'src/shared/service';
import { IPDCMember } from 'src/entities';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import {
  CollectionQuery,
  FilterOperators,
  QueryConstructor,
} from 'src/shared/collection-query';
import { DataResponseFormat } from 'src/shared/api-data';
import {
  BulkIPDCMemberDto,
  IPDCMemberResponseDto,
} from '../dto/ipdc-members.dto';

@Injectable()
export class IPDCMemberService extends ExtraCrudService<IPDCMember> {
  constructor(
    @InjectRepository(IPDCMember)
    private readonly ipdcMemberRepository: Repository<IPDCMember>,
  ) {
    super(ipdcMemberRepository);
  }
  async bulkCreate(itemData: BulkIPDCMemberDto, req?: any): Promise<any> {
    await this.ipdcMemberRepository.delete({
      ipdcId: itemData.ipdcId,
    });
    const members = itemData.members.map((item) => {
      item.ipdcId = itemData.ipdcId;
      item.organizationId = req.user.organization.id;
      item.organizationName = req.user.organization.name;
      return item;
    });
    const item = this.ipdcMemberRepository.create(members);
    await this.ipdcMemberRepository.insert(item);
    return item;
  }

  async findAllIPDCMembers(
    entityId: string,
    query: CollectionQuery,
    req?: any,
  ) {
    query.where.push([
      {
        column: 'ipdcId',
        value: entityId,
        operator: FilterOperators.EqualTo,
      },
    ]);

    query.includes.push('user');
    query.includes.push('user.account');

    const dataQuery = QueryConstructor.constructQuery<IPDCMember>(
      this.ipdcMemberRepository,
      query,
    );
    const response = new DataResponseFormat<IPDCMemberResponseDto>();
    if (query.count) {
      response.total = await dataQuery.getCount();
    } else {
      const [result, total] = await dataQuery.getManyAndCount();
      response.total = total;
      response.items = IPDCMemberResponseDto.toDtos(result);
    }
    return response;
  }
}
