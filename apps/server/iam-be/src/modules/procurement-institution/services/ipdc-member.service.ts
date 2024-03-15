import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { ExtraCrudService } from 'src/shared/service';
import { IPDCMember } from 'src/entities';

@Injectable()
export class IPDCMemberService extends ExtraCrudService<IPDCMember> {
  constructor(
    @InjectRepository(IPDCMember)
    private readonly iPDCMemberRepository: Repository<IPDCMember>,
  ) {
    super(iPDCMemberRepository);
  }
}
