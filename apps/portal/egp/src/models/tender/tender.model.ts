import { ITenderSubmission } from './submission.model';

export interface Tender {
  id: string;
  name: string;
  procurementCategory: string;
  organizationName: string;
  bdsSubmission: ITenderSubmission;
  isBookmarked: boolean;
}
