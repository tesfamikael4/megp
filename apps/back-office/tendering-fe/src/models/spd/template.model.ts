export interface ITemplate {
  id: string;
  spdId: string;
  type:
    | 'main-document'
    | 'bds'
    | 'scc'
    | 'invitation'
    | 'opening-minute'
    | 'evaluation-result'
    | 'evaluation-report'
    | 'award-noitce'
    | 'contract-notice'
    | 'cancelation-notice';
  url: any;
}
