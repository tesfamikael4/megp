import { ApprovedVendorServiceSchema } from '@/shared/schema/venderRenewalSchema';
import { InvoiceData } from './vendorInvoice';
export type VendorStatus =
  | 'Active'
  | 'Approved'
  | 'Adjustment'
  | 'Submitted'
  | 'Rejected'
  | 'new'
  | 'Draft'
  | 'Save';

export type VendorLevel =
  | 'basic'
  | 'detail'
  | 'ppda'
  | 'payment'
  | 'doc'
  | 'preferential'
  | 'review'
  | 'info';

export interface FormData {
  basic: {
    name: string;
    businessType: string;
    countryOfRegistration: string;
    tinNumber: string;
    tinIssuedDate: string;
    registrationNumber: string;
    registrationIssuedDate: string;
  };
  address: {
    physicalAddress: string;
    postalAddress: string;
    primaryEmail: string;
    region: string;
    district: string;
    alternateEmail: string;
    telephone: string;
    fax: string;
    website: string;
  };
  bankAccountDetails: {
    bankId: string;
    hashValue: string;
    bankType: 'International' | 'Local';
    bankName: string;
    branchName: string;
    accountType: 'Saving' | 'Credit' | 'Current';
    accountNumber: string;
    branchAddress?: string;
    accountHolderFullName: string;
    currency: string;
    IBAN?: string;
    swiftCode?: string;
    isDefualt: boolean;
  }[];
  contactPersons: {
    firstName: string;
    lastName: string;
    email: string;
    mobileNumber: string;
  }[];
  businessSizeAndOwnership: {
    registeredCapital: {
      amount: string;
      currency: string;
    };
    paidUpCapital: {
      amount: string;
      currency: string;
    };
    numberOfEmployees: string;
    // ownershipType: string;
  };
  beneficialOwnershipShareholders: {
    firstName: string;
    middleName: string;
    lastName: string;
    nationality: string;
    countryOfResidence: string;
    share: number;
    votingRights: number;
    authorityToAppointGov: boolean;
  }[];
  areasOfBusinessInterest: AreasOfBusinessInterestType[] | [];
  lineOfBusiness: lineOfBusinessSchema[] | [];
  ppdaRegistrationNumber: string;
  ppdaRegistrationDate: string;
  expiryDate: string;
  preferential: PreferentialTreatment[] | [];
  //TODO: Check this later
  invoice: InvoiceData | null;
  supportingDocuments: {
    businessRegistration_IncorporationCertificate: string;
    mRA_TPINCertificate: string;
    generalReceipt_BankDepositSlip: string;
    mRATaxClearanceCertificate: string;
    previousPPDARegistrationCertificate: string;
    mSMECertificate?: string;
  };
  paymentReceipt: {
    transactionId: string;
    category: string;
    invoiceId: string;
    attachment: string;
  } | null;
  businessAreas: {}[];
}

export interface lineOfBusinessSchema {
  id: string;
  name: string;
}

export interface AreasOfBusinessInterestType {
  category: string;
  priceRange: string;
  userType: string; // User type (Contractor, Consultant)
  classification: string; // Classification of Contractor or consultants
  // activationDate: string; // Activation date
  expiryDate?: string; // Expiry date
  ncicRegistrationNumber?: string;
  ncicRegistrationDate?: string;
}

export interface PreferentialTreatment {
  category: string;
  type: string;
  attachment?: any;
  serviceId: string;
  certiNumber: string;
  certificateUrl: any;
  // certificateIssuedDate: string;
  // certificateValidityPeriod: string;
}

export interface AddFormRequestData extends FormData {
  initial: {
    userId: string; //session
    status: string;
    level: string;
  };
}

export interface AddFormRequest {
  data: AddFormRequestData | GetFormResponse;
}

export interface ApplicationInfo {
  id: string;
  vendorId: string;
  serviceId: string;
  instanceId: string;
  category: string;
  approvedAt: string | null;
  applicationNumber: string;
  expireDate: string | null;
  status: string;
  remark: string | null;
  key: string;
  BpService: BpService;
  data?: { data: { documentId: string; userId: string; fileId: string } };
}
export interface BpService {
  name: string;
  key: string;
}
export interface GetVendorInfoResponse {
  name: string;
  tinNumber: string;
  level: string;
  vendorStatus: string;
  Status: string;
  areasOfBusinessInterest: AreasOfBusinessInterestType[];
  services: ApplicationInfo[];
}
export interface GetFormRequest {
  vendorId: string;
}
export interface GetApproveVendorInfoResponse {
  data: GetFormResponse;
}
export interface GetFormResponse extends FormData {
  status: string;
  initial: {
    userId: string; //session
    status: string;
    level: string;
    isPPDARegistered: boolean;
  };
  id?: string;
}
export interface GetApplicationListResponse {
  service: string;
  ApplicationNumber: string;
  submittedAt: string;
  status: string;
}

export interface CreateVendorIdRequest {
  name: string;
  countryOfRegistration: string;
  tinNumber: string;
  tinIssuedDate: string;
  registrationNumber: string;
  registrationIssuedDate: string;
}
export interface CreateVendorIdResponse {
  message?: string;
  vendorId: string;
}
export interface CreateVendorIdResponse {
  vendorId: string;
}
export interface BankNamesResponse {
  id: string;
  bankName: string;
  metaData: Record<string, any>; // You can use Record<string, any> for an empty object
}

export interface LineOfBusinessResponse {
  total: number;
  items: {
    valueFrom: string;
    id: string;
    code: string;
    description: string;
    businessArea: string;
    createdAt: string;
  }[];
}

export interface PriceRangeResponse {
  id: string;
  serviceId: string;
  businessArea: string;
  valueFrom: string;
  valueTo: string;
  currency: string;
  fee: string;
  service: {
    id: string;
    key: string;
    name: string;
    isActive: boolean;
  };
}

export interface GetMBRSDataResponse {
  tin: string;
  businessLicenseNumber: string;
  nationality: string;
  legalStatus: string;
  businessName: string;
  dateRegistered: string;
  organizationName: string;
  firstName: string;
  middleName: string;
  lastName: string;
}

export interface GetFPPADataResponse {
  id: string;
  tin: string;
  supplierCode: string;
  supplierName: string;
  businessType: string;
  accountNo: string;
  accountName: string;
  mobileNumber: string;
}

export interface GetNCICDataResponse {
  id: string;
  tin: string;
  level: string;
  serviceType: string;
}

type Task = {
  id: string;
  bpId: string;
  name: string;
  description: string;
  handlerType: string;
  taskType: string;
  taskCheckList: null;
  label: string;
  orderBy: number;
};

type TaskHandler = {
  id: string;
  taskId: string;
  instanceId: string;
  handlerName: null;
  handlerUserId: null;
  pickedAt: null;
  data: any; // Replace 'any' with a more specific type if possible
  currentState: string;
  assignmentStatus: string;
  previousHandlerId: null;
};
interface HandlerUser {
  id: string;
  exp: number;
  iat: number;
  email: string;
  roles: any[]; // You might want to replace 'any[]' with the actual type of roles
  lastName: string;
  tenantId: number;
  username: string;
  firstName: string;
  permissions: any[]; // You might want to replace 'any[]' with the actual type of permissions
  roleSystems: any[]; // You might want to replace 'any[]' with the actual type of roleSystems
  organization: any; // You might want to replace 'any' with the actual type of organization
}
type TaskTracker = {
  id: string;
  taskId: string;
  instanceId: string;
  handlerUser: HandlerUser;
  handlerUserId: string;
  pickedAt: null | any; // You might want to replace 'any' with the actual type of pickedAt
  data: null | any; // You might want to replace 'any' with the actual type of data
  taskChecklist: null | any; // You might want to replace 'any' with the actual type of taskChecklist
  previousHandlerId: null | any; // You might want to replace 'any' with the actual type of previousHandlerId
  executedAt: string;
  remark: null | any; // You might want to replace 'any' with the actual type of remark
};
type TaskItem = {
  taskHandler: TaskHandler | null;
  taskTracker: TaskTracker | null;
  task: Task;
};
export type GetActivitiesProgressResponse = TaskItem[];

export type GetForRenewalVendorResponse = ApprovedVendorServiceSchema;

export type PostForRenewalVendorResponse = ApprovedVendorServiceSchema;
export type PostForRenewalVendorRequest = {
  businessAreaIds: string[];
};

export type RenewalInvoiceRenewalVendorResponse = PaymentReceipt;
export type RenewalInvoiceRenewalVendorRequest = {
  status: { level: String; status: String };
};

export type ApprovalVendorData = {
  id: string;
  vendorId: string;
  applicationNumber: string;
  approvedAt: string;
  businessAreaState: {
    level: string;
    status: string;
  };
  category: string;
  certificateUrl: string;
  expireDate: string;
  instanceId: string;
  priceRangeId: string;
  remark: null | string;
  serviceId: string;
  status: string;
};

export type GetCertificateInformationResponse = ApprovalVendorData[];

export interface PaymentReceipt {
  id: string;
  refNumber: string;
  serviceId: string;
  paymentDetail: PaymentDetail[];
  payerName: string;
  userId: string;
  payToAccNo: string;
  payToAccName: string;
  payToBank: string;
  amount: string;
  createdOn: string;
  paymentStatus: string;
  remark: string;
  attachment: any;
}

export interface PaymentDetail {
  bc: string;
  fee: string;
  name: string;
  category: string;
  pricingId?: string;
  businessAreaId?: string;
}
