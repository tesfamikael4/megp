export interface ITenderEvaluation {
  id: string;
  tenderId: string;
  bidEvaluationCurrency: any[];
  evaluationMethod: 'point system' | 'compliance';
  selectionMethod: 'LCS' | 'QCBS' | 'QBS' | 'FBS' | 'CQS' | 'SSS' | 'LPS';
  awardType: 'item based' | 'lot based';
  technicalWeight: number;
  financialWeight: number;
  paddingMark: number;
}
