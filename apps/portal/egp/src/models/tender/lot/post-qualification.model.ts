import { RequirementDocument } from './item/requirement-document';

export interface PostQualification {
  id: string;
  lotId: string;
  requirement: string;
  requirementCondition: RequirementDocument;
}
