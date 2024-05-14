export interface ITenderSubmission {
  id: string;
  tenderId: string;
  submissionDeadline: Date;
  openingDate: Date;
  invitationDate?: Date;
  envelopType: 'single envelop' | 'two envelop';
}
export enum EnvelopType {
  SINGLEENVELOP = 'single envelop',
  TWOENVELOP = 'two envelop',
}
