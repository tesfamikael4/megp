import { InjectRepository } from '@nestjs/typeorm';
import { SorReimburseableExpense } from 'src/entities/sor-reimburseable-expense.entity';
import { ExtraCrudService } from 'src/shared/service';
import { Repository } from 'typeorm';

export class SorReimburseableExpenseService extends ExtraCrudService<SorReimburseableExpense> {
  constructor(
    @InjectRepository(SorReimburseableExpense)
    private readonly sorReimburseableExpenseRepository: Repository<SorReimburseableExpense>,
  ) {
    super(sorReimburseableExpenseRepository);
  }
}
