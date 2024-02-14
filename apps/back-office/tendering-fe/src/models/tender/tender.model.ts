import { BidDataSheet } from './lot/bid-data-sheet.model';
import { Lot } from './lot';

export interface Tender {
  id: string;
  name: string;
  description: string;
  procurementNumber: string;
  organizationId: string;
  organizationName: string;
  procurementLanguage: string;
  evaluationMethod: EvaluationMethod;
  lots: Lot[];
  status: Status;
  procurementTechnicalTeam: ProcurementTechnicalTeam[];
  packageSPD: PackageSpd;
  bidDataSheet: BidDataSheet;
}
export interface PackageSpd {
  spdId: string;
  spdName: string;
  governingLaw: string;
}
export interface ProcurementTechnicalTeam {
  id: string;
  packageId: string;
  userId: string;
  startDate: Date;
  endDate: Date;
  status: boolean;
  isTeamLead: boolean;
}
export interface EvaluationMethod {
  evaluationMethod: string;
  selectionMethod: string;
  technicalWeight: string;
  financialWeight: string;
  passingMark: string;
  scoringBasis: string;
  comparisonPrice: string;
  packageType: string;
  envelopType: string;
}
export type Status = 'draft' | 'submitted' | 'approved';
