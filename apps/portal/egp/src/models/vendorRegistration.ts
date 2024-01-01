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
  | 'review'
  | 'info';

export interface FormData {
  basic: {
    name: string;
    businessType: string;
    origin: string;
    tinNumber: string;
    tinIssuedDate: '';
  };
  address: {
    postalAddress: string;
    primaryEmail: string;
    alternateEmail: string;
    mobilePhone: string;
    telephone: string;
    fax: string;
    website: string;
  };
  bankAccountDetails: {
    accountHolderFullName: string;
    accountNumber: number;
    branchAddress: string;
    currency: string;
    bankSwift: string;
    IBAN: string;
    status: string;
    bankId: string;
    bankName: string;
    hashValue: string;
    branchName: string;
    accountType: '';
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
    ownershipType: string;
  };
  shareHolders: {
    firstName: string;
    lastName: string;
    nationality: string;
    share: string;
  }[];
  beneficialOwnership: {
    firstName: string;
    lastName: string;
    nationality: string;
  }[];
  areasOfBusinessInterest: AreasOfBusinessInterestType[] | [];
  invoice: InvoiceData[] | [];
  supportingDocuments: {
    businessRegistration_IncorporationCertificate: string;
    mRA_TPINCertificate: string;
    generalReceipt_BankDepositSlip: string;
    mRATaxClearanceCertificate: string;
    previousPPDARegistrationCertificate: string;
    mSMECertificate: string;
  };
  paymentReceipt: {
    transactionId: string;
    category: string;
    invoiceId: string;
    attachment: string;
  } | null;
}

export interface AreasOfBusinessInterestType {
  category: string;
  lineOfBusiness: {
    id: string;
    name: string;
  }[];
  priceRange: string;
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
  BpService: BpService;
}
export interface BpService {
  name: string;
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

export interface GetFormResponse extends FormData {
  initial: {
    userId: string; //session
    status: string;
    level: string;
  };
  id?: string;
}

export interface CreateVendorIdRequest {
  name: string;
  businessType: string;
  origin: string;
  tinNumber: string;
  tinIssuedDate: string;
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
  status: { level: String; status: String };
  businessArea: string[];
};

export type RenewalInvoiceRenewalVendorResponse = {
  total: number;
  items: InvoiceData[];
  businessAreas: {
    id: string;
    vendorId: string;
    priceRangeId: string;
    serviceId: string;
    businessAreaState: {
      level: string;
      status: string;
    };
    instanceId: string;
    category: string;
    approvedAt: null | string;
    applicationNumber: string;
    certificateUrl: null | string;
    expireDate: null | string;
    status: string;
    remark: null | string;
  }[];
  paymentReceipt: {
    transactionId: string;
    category: string;
    invoiceId: string;
    attachment: string;
  };
};
export type RenewalInvoiceRenewalVendorRequest = {
  status: { level: String; status: String };
};
