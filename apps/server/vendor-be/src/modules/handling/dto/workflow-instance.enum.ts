export enum WorkflowInstanceEnum {
  Draft = 'Draft',
  Submitted = 'Submit',
  Inprogress = 'Inprogress',
  Completed = 'Completed',
  Rejected = 'Rejected',
  Approved = 'Approved',
  OutDated = 'Outdated'
}


export enum BusinessStatusEnum {
  active = 'Active',
  inactive = 'Inactive',
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
export enum ApplicationStatus {
  DRAFT = 'Draft',
  SUBMIT = 'Submit',
  Adjust = 'Adjust',
  SUBMITTED = 'Submitted',
}