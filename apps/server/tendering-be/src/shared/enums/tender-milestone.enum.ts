export enum TenderMilestoneEnum {
  Initiation = 100,
  Configuration = 102,
  Preparation = 104,
  Revision = 106,
  Submission = 108,
  Approval = 110,
  Publication = 112,

  Solicitation = 200,
  ClarificationRequest = 201,
  ClarificationResponse = 202,
  SiteVisit = 203,
  BidderConference = 204,
  Amendment = 205,
  TenderInvitationClosing = 299,

  Evaluation = 300,
  TechnicalOpening = 301,
  TechnicalOnlyOpening = 302,
  TechnicalCompliance = 303,
  TechnicalQualification = 304,
  TechnicalResponsiveness = 305,
  TechnicalScoring = 306,
  TechnicalEndorsement = 307,
  TechnicalStandstill = 308,
  TechnicalPreEndorsement = 309,

  FinancialOpening = 320,
  FinancialOnlyOpening = 321,
  FinancialCompliance = 322,
  FinancialBidPriceValuation = 323,
  FinancialQualification = 324,
  FinancialScoring = 325,

  PriceAnalysis = 326,
  PostQualification = 327,

  CombinationAssessment = 340,
  FinalEndorsement = 360,
  FinalStandstill = 361,
  FinalPreEndorsement = 362,

  Awarding = 400,
  AwardNegotiation = 401,
  PartialAwarding = 402,

  Contracting = 500,
  ContractSigning = 503,
  LetterOfCreditOpening = 505,
  Mobilization = 507,
  Implementing = 600,
  InspectionAndAcceptance = 609,
  FinalAcceptance = 612,
  ContractClosure = 615,

  Closing = 9999,
  Unknown = 9901,
}

const MilestoneLabels: { [key in TenderMilestoneEnum]: string } = {
  [TenderMilestoneEnum.Initiation]: 'Initiation',
  [TenderMilestoneEnum.Configuration]: 'Configuration',
  [TenderMilestoneEnum.Preparation]: 'Preparation',
  [TenderMilestoneEnum.Revision]: 'Revision',
  [TenderMilestoneEnum.Submission]: 'Submission',
  [TenderMilestoneEnum.Approval]: 'Approval',
  [TenderMilestoneEnum.Publication]: 'Publication',

  [TenderMilestoneEnum.Solicitation]: 'Solicitation',
  [TenderMilestoneEnum.ClarificationRequest]: 'Clarification Request',
  [TenderMilestoneEnum.ClarificationResponse]: 'Clarification Response',
  [TenderMilestoneEnum.SiteVisit]: 'Site Visit',
  [TenderMilestoneEnum.BidderConference]: 'Bidder Conference',
  [TenderMilestoneEnum.Amendment]: 'Amendment',
  [TenderMilestoneEnum.TenderInvitationClosing]: 'Tender Invitation Closing',

  [TenderMilestoneEnum.Evaluation]: 'Evaluation',
  [TenderMilestoneEnum.TechnicalOpening]: 'Technical Opening',
  [TenderMilestoneEnum.TechnicalOnlyOpening]: 'Technical Only Opening',
  [TenderMilestoneEnum.TechnicalCompliance]: 'Technical Compliance',
  [TenderMilestoneEnum.TechnicalQualification]: 'Technical Qualification',
  [TenderMilestoneEnum.TechnicalResponsiveness]: 'Technical Responsiveness',
  [TenderMilestoneEnum.TechnicalScoring]: 'Technical Scoring',
  [TenderMilestoneEnum.TechnicalEndorsement]: 'Technical Endorsement',
  [TenderMilestoneEnum.TechnicalStandstill]: 'Technical Standstill',
  [TenderMilestoneEnum.TechnicalPreEndorsement]: 'Technical Pre-Endorsement',

  [TenderMilestoneEnum.FinancialOpening]: 'Financial Opening',
  [TenderMilestoneEnum.FinancialOnlyOpening]: 'Financial Only Opening',
  [TenderMilestoneEnum.FinancialCompliance]: 'Financial Compliance',
  [TenderMilestoneEnum.FinancialBidPriceValuation]:
    'Financial Bid Price Valuation',
  [TenderMilestoneEnum.FinancialQualification]: 'Financial Qualification',
  [TenderMilestoneEnum.FinancialScoring]: 'Financial Scoring',

  [TenderMilestoneEnum.PriceAnalysis]: 'Price Analysis',
  [TenderMilestoneEnum.PostQualification]: 'Post Qualification',

  [TenderMilestoneEnum.CombinationAssessment]: 'Combination Assessment',
  [TenderMilestoneEnum.FinalEndorsement]: 'Final Endorsement',
  [TenderMilestoneEnum.FinalStandstill]: 'Final Standstill',
  [TenderMilestoneEnum.FinalPreEndorsement]: 'Final Pre-Endorsement',

  [TenderMilestoneEnum.Awarding]: 'Awarding',
  [TenderMilestoneEnum.AwardNegotiation]: 'Award Negotiation',
  [TenderMilestoneEnum.PartialAwarding]: 'Partial Awarding',

  [TenderMilestoneEnum.Contracting]: 'Contracting',
  [TenderMilestoneEnum.ContractSigning]: 'Contract Signing',
  [TenderMilestoneEnum.LetterOfCreditOpening]: 'Letter Of Credit Opening',
  [TenderMilestoneEnum.Mobilization]: 'Mobilization',
  [TenderMilestoneEnum.Implementing]: 'Implementing',
  [TenderMilestoneEnum.InspectionAndAcceptance]: 'Inspection And Acceptance',
  [TenderMilestoneEnum.FinalAcceptance]: 'Final Acceptance',
  [TenderMilestoneEnum.ContractClosure]: 'Contract Closure',

  [TenderMilestoneEnum.Closing]: 'Closing',
  [TenderMilestoneEnum.Unknown]: 'Unknown',
};
