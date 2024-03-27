export interface ITenderSubmission {
  id: string;
  tenderId: string;
  submissionDeadline: Date;
  openingDate: Date;
  invitationDate?: Date;
  envelopType: 'single envelop' | 'two envelops';
}
