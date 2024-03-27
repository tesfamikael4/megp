export interface ITenderEvaluation {
  id: string;
  tenderId: string;
  bidEvaluationCurrency: any[];
  evaluationMethod: 'point system' | 'compliance';
  selectionMethod:
    | 'lowest price'
    | 'meat'
    | 'lcs'
    | 'qcbs'
    | 'fbs'
    | 'cqs'
    | 'sss';
  awardType: 'item based' | 'lot based';
  technicalWeight: number;
  financialWeight: number;
  paddingMark: number;
}
