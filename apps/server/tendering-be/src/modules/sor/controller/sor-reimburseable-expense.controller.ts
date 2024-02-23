import { ExtraCrudController } from 'src/shared/controller';
import { SorReimburseableExpenseService } from '../service/sor-reimburseable-expense.service';
import { SorReimburseableExpense } from 'src/entities/sor-reimburseable-expense.entity';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import {
  CreateSorReimburseableExpenseDto,
  UpdateSorReimburseableExpenseDto,
} from '../dto/sor-reimburseable-expense.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Controller } from '@nestjs/common';

const options: ExtraCrudOptions = {
  entityIdName: 'itemId',
  createDto: CreateSorReimburseableExpenseDto,
  updateDto: UpdateSorReimburseableExpenseDto,
};

@ApiBearerAuth()
@Controller('sor-reimburseable-expense')
@ApiTags('Sor Reimburseable Expense Controller')
export class SorReimburseableExpenseController extends ExtraCrudController<SorReimburseableExpense>(
  options,
) {
  constructor(
    private readonly sorReimburseableExpensesService: SorReimburseableExpenseService,
  ) {
    super(sorReimburseableExpensesService);
  }
}
