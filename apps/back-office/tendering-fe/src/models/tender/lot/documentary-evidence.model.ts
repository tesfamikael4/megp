export interface DocumentaryEvidence {
  id: string;
  lotId: string;
  checkOnFirstCompliance: boolean;
  checkOnFirstOpening: boolean;
  checkOnSecondCompliance: boolean;
  checkOnSecondOpening: boolean;
  evidenceTitle: string;
  evidenceType: string;
  isRequired: boolean;
  requiredTo: string;
  sectionLink: string;
  spdDocumentaryEvidenceId: string;
}
