export interface Spd {
  id: string;
  collectionId: string;
  name: string;
  language: string;
  description?: string;
  isActive: boolean | string;
  meta?: any;
  marketType: string;
  procurementCategory: ProcurementCategory;
  procurementMethod: string;
  procurementTool: string;
  procurementType: string;
  governingRule: string;
}
export enum ProcurementCategory {
  Goods = 'Goods',
  Works = 'Works',
  ConsultancyServices = 'Consultancy Services',
  NonConsultancyServices = 'Non Consultancy Services',
}
export enum MarketType {
  National = 'National',
  International = 'International',
}

export enum ContractingTypes {
  SingleContract = 'Single Contract',
  FrameworkContract = 'Framework Contract',
  ConcessionContract = 'Concession Contract',
}

export enum GoverningRule {
  TFROE = 'The Federal Republic of Ethiopia',
  TWB = 'The World Bank',
}

export enum ProcurementMethod {
  Open = 'Open',
  Selective = 'Selective',
  Limited = 'Limited',
  Direct = 'Direct',
}

export enum ProcurementTool {
  RequestForBid = 'Request for Bid',
  RequestForProposal = 'Request for Proposal',
  RequestForQuotation = 'Request for Quotation',
  JobSpecifications = 'Job Specifications',
}
export enum Language {
  AM = 'am',
  EN = 'en',
}
