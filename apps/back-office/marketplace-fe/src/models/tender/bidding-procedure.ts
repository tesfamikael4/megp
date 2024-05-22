export interface BiddingProcedure {
  id: string;
  rfxId: string;
  bidValidityPeriod: number;
  submissionDeadline: string;
  openingDate: string;
  invitationDate: string;
  deltaPercentage: number;
  isReverseAuction: true;
  round: number;
  minimumBidDecrementPercentage: number;
  roundDuration: number;
}
