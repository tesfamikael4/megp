export interface ITenderPreparation {
  id: string;
  tenderId: string;
  currencyOfTheBidForNationalBidders: Currency;
  currencyOfTheBidForInternationalBidders: Currency;
  incotermsEdition: string;
  incotermType: 'DDP';
  bidValidityPeriod: number;
}

export interface Currency {
  localInput:
    | 'Local currency Only'
    | 'Freely convertible foreign currency allowed';
  importedInput:
    | 'Local currency Only'
    | 'Freely convertible foreign currency allowed';
}
