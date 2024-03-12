export const procurementType = [
  'Goods',
  'Works',
  'Non Consulting Services',
  'Consultancy Services',
  'Motor Vehicle Repair',
];

export const procurementMethods = [
  'Request for Quotation (RFQ)',
  'National Competitive Bidding (NCB)',
  'International Competitive Bidding (ICB)',
  'Restricted Tender',
  'Single Source Procurement',
  'Request for Proposal (RFP)',
  'Two Stage Bidding',
  'Framework Procurement',
  'Purchased Orders (Call off)',
];

export const procurementMethodRuleKeys = {
  requestForQuotation: 'Request for Quotation (RFQ)',
  nationalCompetitiveBidding: 'National Competitive Bidding (NCB)',
  internationalCompetitiveBidding: 'International Competitive Bidding (ICB)',
  shortListing: 'Restricted Tender',
  expressionOfInterest: 'Request for Proposal (RFP)',
};

export const targetGroupRuleKeys = {
  micro: 'Micro Enterprises',
  small: 'Small Enterprises',
  medium: 'Medium Enterprises',
};

export const fundingSources = ['Internal Revenue', 'Treasury', 'Loan', 'Donor'];

export const targetGroups = [
  { value: 'IBM', label: 'Indigenous Black Malawian' },
  {
    value: 'Micro Enterprises',
    label: 'Micro Enterprises',
  },
  {
    value: 'Small Enterprises',
    label: 'Small Enterprises',
  },
  {
    value: 'Medium Enterprises',
    label: 'Medium Enterprises',
  },
  { value: 'Marginalized Group', label: 'Marginalized Group' },
  { value: 'Others', label: 'Others' },
];
