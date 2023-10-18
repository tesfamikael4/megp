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
  total: number;
  items: {
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
  }[];
}
export interface GetFormRequest {
  vendorId: string;
}
export interface GetFormResponse extends FormData {
  id: string;
  userId: string;
  status: string;
}

export interface CreateVendorIdRequest {
  status: string;
  name: string;
  businessType: string;
  origin: string;
  district: string;
  country: string;
  tinNumber: string;
}
export interface CreateVendorIdResponse {
  vendorId: string;
}

export interface FormData {
  basic: {
    name: string;
    businessType: string;
    origin: string;
    district: string;
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
    bankBranchAddress: string;
    currency: string;
    bankSWIFT_BICCode: string;
    iBAN: string;
    status: string;
    bankId: string;
    bankName: string;
    hashValue: string;
    branchName: string;
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
  areasOfBusinessInterest: {
    category: string;
    lineOfBusiness: {
      id: string;
      name: string;
    }[];
    priceRange: string;
  }[];
  supportingDocuments: {
    businessRegistration_IncorporationCertificate: File | string | null;
    mRA_TPINCertificate: File | string | null;
    generalReceipt_BankDepositSlip: File | string | null;
    mRATaxClearanceCertificate: File | string | null;
    previousPPDARegistrationCertificate: File | string | null;
    mSMECertificate: File | string | null;
  };
}
