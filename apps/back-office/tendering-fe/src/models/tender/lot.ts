import { AdministrativeCompliance } from './lot/administrative-compliance.model';
import { BidDataSheet } from './lot/bid-data-sheet.model';
import { TechnicalScoring } from './lot/technical-scoring.model';
import { Qualification } from './lot/qualification';
import { SpecialConditionOfContract } from './lot/scc';

export interface Lot {
  id: string;
  procurementRequisitionId: string;
  organizationId: string;
  name: string;
  description: string;
  globalCode: string;
  referenceNumber: string;
  procurementCategory: string;
  marketType: string;
  procurementMethod: string;
  procurementType: string;
  specializationType: string;
  estimatedAmount: number;
  previousReferenceNumber: string;
  requiredAuction: boolean;
  deliveryDate: Date;
  invitationDate: Date;
  lotProcurementMechanism: any;
  applicationRule: string; // must clear application rule model
  status: boolean;
  bidDataSheets: BidDataSheet[];
  specialConditionOfContract: SpecialConditionOfContract[];
  priceAnalysis: PriceAnalysis[];
  postQualifications: PostQualification[];
  preferenceMargins: MarginOfPreference[];
  generalExperience: GeneralExperience[];
  specificExperience: SpecificExperience[];
  compliance: AdministrativeCompliance[];
  qualifications: Qualification[];
  technicalScoring: TechnicalScoring[];
  requiredDocumentaryEvidences: any[];
  metadata: { [data: string]: any };
}
export interface PostQualification {
  id: string;
  requirement: string;
  sectionLink: any;
  requirementCondition: string;
}
export interface PriceAnalysis {
  id: string;
  requirement: string;
  sectionLink: any;
  requirementCondition: string;
}
export interface MarginOfPreference {
  id?: string;
  lotInPackageId: string;
  name: string;
  condition: string;
  margin: number;
}
export interface GeneralExperience {
  id?: string;
  lotId?: string;
  option?: number;
  minimumYearsOfExperience?: number;
  contractValueOfAtleast?: number;
  periodCovered?: number;
  remark?: string;
}
export interface SpecificExperience {
  id?: string;
  option?: number;
  minimumYearsOfExperience?: number;
  contractValueOfAtleast?: number;
  periodCovered?: number;
  minimumPercentageCompletion?: number;
  remark?: string;
}
export const BidSecurityType = [
  'Bank/Wire Transfer',
  'Bank_Guarantee',
  'Insurance_Letter',
  'Letter_from_Small_and_Micro_Enterprise',
];
export const LotStatuses = [
  'configuration',
  'preparation',
  'invitation',
  'revision',
  'submission',
  'Approval',
];
