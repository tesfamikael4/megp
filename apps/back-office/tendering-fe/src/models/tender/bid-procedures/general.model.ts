export interface ITenderGeneral {
  id: string;
  tenderId: string;
  jointVentureAllowed: boolean;
  maximumNumberOfMembers: number;
  subcontractAllowed: boolean;
  maximumPercentageSubcontractingAllowed: number;
  clarificationDeadline: Date;
  preBidConferenceRequired: boolean;
  preBidConferenceDate: Date;
  siteVisitAllowed: boolean;
}
