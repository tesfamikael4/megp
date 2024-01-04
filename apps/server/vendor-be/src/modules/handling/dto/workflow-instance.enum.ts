export enum WorkflowInstanceEnum {
  Draft = 'Draft',
  Submitted = 'Submit',
  Inprogress = 'Inprogress',
  Completed = 'Completed',
  Rejected = 'Rejected',
  Approved = 'Approved',
  OutDated = 'Outdated'
}
export enum ServiceKeyEnum {
  new = 'new',
  upgrade = 'upgrade',
  renewal = 'renewal',
  update = 'update',
  goodsNewRegistration = 'GoodsNewRegistration',
  servicesNewRegistration = 'ServicesNewRegistration',
  worksNewRegistration = 'WorksNewRegistration',
  goodsRenewal = 'GoodsRenewal',
  servicesRenewal = 'ServicesRenewal',
  worksRenewal = 'WorksRenewal',
  goodsUpgrade = 'GoodsUpgrade',
  servicesUpgrade = 'ServicesUpgrade',
  worksUpgrade = 'WorksUpgrade',
  profileUpdate = 'ProfileUpdate',
}

export enum BusinessStatusEnum {
  active = 'Active',
  inactive = 'Inactive',
}
export enum AssignmentEnum {
  Picked = 'Picked',
  Unpicked = 'Unpicked',
}
export enum HandlerTypeEnum {
  Assignee = 'Assignee',
  PreviousHandler = 'Previous Handler',
  Requestor = 'Requestor',
  System = 'System',
}
export enum ReviewStatus {
  Approve = 'Approve',
  Reject = 'Reject',
  Adjust = 'Adjust',
}
