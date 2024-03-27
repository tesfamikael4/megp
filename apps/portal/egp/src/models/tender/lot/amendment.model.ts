export interface Amendment {
  id: string;
  lotInPackageId: string;
  amendmentInstructionId: string;
  referenceNumber: string;
  amendmentName: string;
  amendmentDescription: string;
  status: string;
  organizationId: string;
  organizationName: any;
  timestamp: Date;
}

export interface AmendmentInstruction {
  id: string;
  lotInPackageId: string;
  amendmentName: string;
  amendmentDescription: string;
  instruction: string;
  referenceNumber: string;
  status: string;
  issuedById: string;
  issuedByName: any;
  instructionDate: string;
  instructionStatus: string;
  organizationId: string;
  organizationName: any;
  timestamp: Date;
}

export interface AmendmentDetail {
  id: string;
  lotInPackageId: string;
  amendmentId: string;
  settingName: string;
  previousValue: string;
  currentValue: string;
}

export const Tags = [
  'Item and schedule of requirement',
  'Qualification Criteria',
  'Documentary Requirement',
  'Settings',
];
