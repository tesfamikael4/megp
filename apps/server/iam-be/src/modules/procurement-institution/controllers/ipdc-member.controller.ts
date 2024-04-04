import { Body, Controller, Post, Req, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { ExtraCrudController } from 'src/shared/controller';
import {
  BulkIPDCMemberDto,
  CreateIPDCMemberDto,
  UpdateIPDCMemberDto,
} from '../dto/ipdc-members.dto';
import { IPDCMemberService } from '../services/ipdc-member.service';
import { IPDCMember } from 'src/entities';
import {
  CollectionQuery,
  FilterOperators,
  QueryConstructor,
} from 'src/shared/collection-query';

const options: ExtraCrudOptions = {
  entityIdName: 'ipdcId',
  createDto: CreateIPDCMemberDto,
  updateDto: UpdateIPDCMemberDto,
};

@Controller('ipdc-Member')
@ApiTags('ipdc-Member')
export class IPDCMemberController extends ExtraCrudController<IPDCMember>(
  options,
) {
  constructor(private readonly IPDCMemberService: IPDCMemberService) {
    super(IPDCMemberService);
  }

  @Post('bulk-create')
  async bulkCreate(
    @Body() members: BulkIPDCMemberDto,
    @Req() req: any,
  ): Promise<BulkIPDCMemberDto> {
    return this.IPDCMemberService.bulkCreate(members, req);
  }

  @Get('findAllIPDCMembers/:id')
  async findAllIPDCMembers(
    @Param('id') id: string,
    @Query() query: CollectionQuery,
  ) {
    return this.IPDCMemberService.findAllIPDCMembers(id, query);
  }
}
