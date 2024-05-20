export interface RevisionApproval {
  id: string;
  status: 'APPROVED' | 'APPROVED_WITH_COMMENT' | 'ADJUST_WITH_COMMENT';
  tenderId: string;
}

export enum RevisionApprovalStatusEnum {
  APPROVED = 'APPROVED',
  APPROVED_WITH_COMMENT = 'APPROVED_WITH_COMMENT',
  ADJUST_WITH_COMMENT = 'ADJUST_WITH_COMMENT',
}
