export enum Gender {
  Male = 1,
  Female = 2,
}
export enum ApprovalType {
  PrebudgetPlan = 'PrebudgetPlan',
  PostbudgetPlan = 'PostbudgetPlan',
}
export enum FundingSource {
  Budget = 'Budget',
  Grant = 'Grant',
  OwnFund = 'OwnFund',
}
export enum PlanInitiationStatus {
  Initaited = 'Initaited',
  PrebudgetPlanReviewed = 'PrebudgetPlanReviewed',
  PrebudgetPlanApproved = 'PrebudgetPlanApproved',
  PostBudgetReviewed = 'PostBudgetReviewed',
  PostBudgetApproved = 'PostBudgetApproved',
}
export enum PrebudgetPlanStatus {
  Created = 'Created',
  Reviewed = 'Reviewed',
  Approved = 'Approved',
}
export enum ProcurementCategory {
  Works = 'Works',
  Goods = 'Goods',
  RoutineService = 'RoutineService',
  ConsultancyService = 'ConsultancyService',
}
//RFQ=Request for Quotation, NCB=National Competitive Bidding,
//Restricted=Restricted tender, RFP=Request for Proposals
export enum ProcurementMethod {
  RFQ = 'RFQ',
  NCB = 'NCB',
  Restricted = 'Restricted',
  SingleSourcing = 'SingleSourcing',
  RFP = 'RFP',
  Framework = 'Framework',
}

export enum ProcurementStatus {
  TobeTendered = 'TobeTendered',
  UnderExcution = 'UnderExcution',
}

export enum ItemCodeReferenceType {
  PriceIndex = 'PriceIndex',
  UNSPSC_CodeSet = 'UNSPSC_CodeSet',
  CPV_CodeSet = 'CPV_CodeSet',
}

export enum UOMCategory {
  Count = 'Count',
  Weight = 'Weight',
  Liquid = 'Liquid',
  Distance = 'Distance',
  Area = 'Area',
}

export enum Currency {
  Kwacha = 'Kwacha',
  USD = 'USD',
  Euros = 'Euros',
}
