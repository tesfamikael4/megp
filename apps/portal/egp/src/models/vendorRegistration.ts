import { InvoiceData } from './vendorInvoice';
export interface FormData {
  basic: {
    name: string;
    businessType: string;
    origin: string;
    district?: string;
    country: string;
    tinNumber: string;
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
    id: string;
    userId: string; //session
    status: string;
    level: string;
  };
}

export interface AddFormRequest {
  data: AddFormRequestData | GetFormResponse;
}

export interface GetFormRequest {
  vendorId: string;
}

export interface GetFormResponse extends FormData {
  initial: {
    id: string;
    userId: string; //session
    status: string;
    level: string;
  };
}

export interface CreateVendorIdRequest {
  status?: string;
  name: string;
  businessType: string;
  origin: string;
  country: string;
  district?: string;
  tinNumber: string;
  tinIssuedDate: string;
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
