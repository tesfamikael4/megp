import { Item } from './item';

export interface ConsultancyItem extends Item {
  reimburseableExpense: ReimburseableExpense[];
  fee: Fee[];
}
export interface Fee {
  id?: string;
  lotId: string;
  itemId: string;
  no: number;
  nameOfStaff?: string;
  position?: string;
  staffMonthRate?: string;
  inputStaffMonth?: string;
  rate?: string;
  category: string;
  manMonthRateForLiability?: string;
  manMonthRateForConstruction?: string;
}
export interface ReimburseableExpense {
  id?: string;
  lotId: string;
  itemId: string;
  no: number;
  description: string;
  unitCost: number;
  unit?: string;
  quantity?: number;
  cost?: number;
  category?: string;
}
export const ReimburseableExpenseList = [
  {
    description: 'Per diem allowances',
    unit: 'Day',
  },
  {
    description: 'International flights',
    unit: 'Trip',
  },
  {
    description: 'Miscellaneous travel expenses',
    unit: 'Trip',
  },
  {
    description: 'Communication costs between and',
    unit: '',
  },
  {
    description: 'Drafting, reproduction of report',
    unit: '',
  },
  {
    description: 'Equipment, instruments, materials, supplies, etc.',
    unit: '',
  },
  {
    description: 'Shipment of personal effects',
    unit: 'Trip',
  },
  {
    description: 'Use of computers, software',
    unit: '',
  },
  {
    description: 'Laboratory tests',
    unit: '',
  },
  {
    description: 'Subcontracts',
    unit: '',
  },
  {
    description: 'Local transportation costs',
    unit: '',
  },
  {
    description: 'Office rent, clerical assistance',
    unit: '',
  },
];
