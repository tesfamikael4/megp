export enum WorkflowInstanceEnum {
  Draft = 'Draft',
  Submitted = 'Submit',
  Inprogress = 'Inprogress',
  Completed = 'Completed',
  Rejected = 'Rejected',
  Approved = 'Approved',
}
export enum ServiceKeyEnum {
  new = 'new',
  upgrade = 'upgrade',
  renewal = 'renewal',
  goodsNewRegistration = 'goodsNewRegistration',
  servicesNewRegistration = 'servicesNewRegistration',
  worksNewRegistration = 'worksNewRegistration',
  goodsRenewal = 'goodsRenewal',
  servicesRenewal = 'servicesRenewal',
  worksRenewal = 'workRenewal',
  goodsUpgrade = 'goodsUpgrade',
  servicesUpgrade = 'servicesUpgrade',
  worksUpgrade = 'worksUpgrade',
  profileUpdate = 'profileUpdate',
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
