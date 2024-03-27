export interface DocumentaryEvidence {
  id: string;
  lotInPackageId: string;
  checkOnFirstCompliance: boolean;
  checkOnFirstOpening: boolean;
  checkOnSecondCompliance: boolean;
  checkOnSecondOpening: boolean;
  evidenceTitle: string;
  evidenceType: string;
  isRequired: string;
  requiredTo: string;
  sectionLink: string;
  spdDocumentaryEvidenceId: string;
}
