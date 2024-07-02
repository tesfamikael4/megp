import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtraCrudService } from 'megp-shared-be';
import { EvalApprovalDetail } from 'src/entities/eval-approval-details.entity';
import { Repository } from 'typeorm';

@Injectable()
export class EvalApprovalDetailService extends ExtraCrudService<EvalApprovalDetail> {
  constructor(
    @InjectRepository(EvalApprovalDetail)
    private readonly evalApprovalDetailRepository: Repository<EvalApprovalDetail>,
  ) {
    super(evalApprovalDetailRepository);
  }
}
