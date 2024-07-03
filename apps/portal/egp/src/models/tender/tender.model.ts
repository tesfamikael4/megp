import { ITenderSubmission } from './submission.model';

export interface Tender {
  id: string;
  name: string;
  description: string;
  procurementCategory: string;
  organizationName: string;
  objectType: 'RFX' | 'TENDER';
  bdsSubmission: ITenderSubmission;
  isBookmarked: boolean;
  publishmentDate?: string;
  closingDate?: string;
}
