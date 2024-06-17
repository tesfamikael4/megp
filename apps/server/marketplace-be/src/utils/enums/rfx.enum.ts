export enum ERfxStatus {
  DRAFT = 'DRAFT',
  TEAM_REVIEWAL = 'TEAM_REVIEWAL',
  ADJUSTMENT = 'ADJUSTMENT',

  SUBMITTED = 'SUBMITTED',
  SUBMITTED_EVALUATION = 'SUBMITTED_EVALUATION',

  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',

  EVALUATION = 'EVALUATION',
  EVALUATION_REJECTED = 'EVALUATION_REJECTED',

  AUCTION = 'AUCTION',
  ENDED = 'ENDED',
}

export enum ERfxItemStatus {
  DRAFT = 'DRAFT',
  PENDING = 'PENDING',
  INVITATION_PREPARED = 'INVITATION_PREPARED',
  SUBMITTED = 'SUBMITTED',
  APPROVED = 'APPROVED',

  COMPLETED = 'COMPLETED',
  REJECTED = 'REJECTED',

  ENDED = 'ENDED',
}

export enum EInvitationStatus {
  DRAFT = 'DRAFT',
  PENDING = 'PENDING',
  SUBMITTED = 'SUBMITTED',

  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',

  ACCEPTED = 'ACCEPTED',
  DISCARDED = 'DISCARDED',
  WITHDRAWN = 'WITHDRAWN',

  COMPLY = 'COMPLY',
  NOT_COMPLY = 'NOT_COMPLY',

  ENDED = 'ENDED',
  EXPIRED = 'EXPIRED',
}

export enum ERfxOpenProductsStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  SELECTED = 'SELECTED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
}

export enum ERfxRevisionApprovalStatusEnum {
  APPROVED = 'APPROVED',
  ADJUST = 'ADJUST',
}
