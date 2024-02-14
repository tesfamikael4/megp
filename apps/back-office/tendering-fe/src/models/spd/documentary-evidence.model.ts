export interface SpdDocumentaryEvidence {
  id: string;
  spdId: string;
  checkOnFirstCompliance: boolean;
  checkOnFirstOpening: boolean;
  checkOnSecondCompliance: boolean;
  checkOnSecondOpening: boolean;
  evidenceTitle: string;
  evidenceType: string;
  isRequired: boolean;
  requiredTo: string;
  sectionLink: string;
}
export enum EvidenceType {
  VTL = 'Valid Trade License',
  VRC = 'Vat Registration Certificate',
  VTCC = 'Valid Tax Clearance Certificate',
  BORC = 'Business Organization Registration Certificate',
  RPPC = 'Relevant Professional Practice Certificate',
  BS = 'Bid Security',
  PMD = 'Preference Margin Declaration',
  OD = 'Other Documents',
}

export enum RequiredTo {
  LocalBiddersOnly = 'Local bidders only',
  ForeignBiddersOnly = 'Foreign bidders only',
  BothLocalAndForeignBidders = 'Both local and foreign bidders',
}
