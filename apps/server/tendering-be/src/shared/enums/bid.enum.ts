export enum BidRegistrationStatusEnum {
  PENDING = 'PENDING',
  REGISTERED = 'REGISTERED',
  SUBMITTED = 'SUBMITTED',
}

export enum BidBookmarkStatusEnum {
  BOOKMARKED = 'BOOKMARKED',
  REGISTERED = 'REGISTERED',
}

export enum BidRegistrationDetailStatusEnum {
  NOT_SUBMITTED = 'NOT_SUBMITTED',
  SUBMITTED = 'SUBMITTED',
}

export enum AwardTypeEnum {
  ITEM_BASED = 'item based',
  LOT_BASED = 'lot based',
}

export enum EvaluationMethodEnum {
  POINT_SYSTEM = 'point system',
  COMPLIANCE = 'compliance',
}

export enum SelectionMethodEnum {
  LOWEST_PRICE = 'lowest price',
  LOT_BASED = 'highest price',
}

export enum BidGuaranteeStatusEnum {
  DRAFT = 'DRAFT',
  REQUESTED = 'REQUESTED',
  REVIEWED = 'REVIEWED',
  REJECTED = 'REJECTED',
  VERIFIED = 'VERIFIED',
  APPROVED = 'APPROVED',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED',
}

export enum BidGuaranteeForefitStatusEnum {
  REQUESTED = 'REQUESTED',
  REVIEWED = 'REVIEWED',
  VERIFIED = 'VERIFIED',
  APPROVED = 'APPROVED',
}

export enum BidGuaranteeReleaseEnum {
  REQUESTED = 'REQUESTED',
  RELEASED = 'RELEASED',
  AUTO_RELEASED = 'AUTO_RELEASED',
}

export enum BidGuaranteeExtensionEnum {
  INITIATED = 'INITIATED',
  REQUESTED = 'REQUESTED',
  REVIEWED = 'REVIEWED',
  VERIFIED = 'VERIFIED',
  APPROVED = 'APPROVED',
}

export enum BidGuaranteeCancellationEnum {
  REQUESTED = 'REQUESTED',
  CANCELLED = 'CANCELLED',
}
