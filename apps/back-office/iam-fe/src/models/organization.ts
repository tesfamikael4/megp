export interface Organization {
  isActive: string | boolean;
  id: string;
  name: string;
  code?: string;
  status: string;
  shortName: string;
  description: string;
  type: string;
  budgetType: string;
  isLocked: boolean;
  typeId: string;
  sectorId: string;
}
