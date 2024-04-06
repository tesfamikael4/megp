export interface TechnicalBidDeclaration {
  bidSubmissionDeadline: Date;
  bidValidity: Number;
  biddersAuthorizedPerson: BiddersAuthorizedPerson[];
}
export interface BiddersAuthorizedPerson {
  fullName: string;
  position: string;
  email: string;
  phone: string;
}
