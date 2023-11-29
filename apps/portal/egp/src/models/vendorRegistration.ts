import { InvoiceData } from './vendorInvoice';
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
  }[];
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

type TaskItem = {
  taskHandler: TaskHandler | null;
  taskTracker: null;
  task: Task;
};
export type GetActivitiesProgressResponse = TaskItem[];
