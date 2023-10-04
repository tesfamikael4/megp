export interface FormInitiationRequest {
  companyName: string;
  legalFormofEntity: string;
  Country: string;
  tinNumber: string;
}
export interface FormSubmissionRequest {
  data: {
    userId: string;
    status: string;
    id: string;
    data: {
      basicRegistration: {
        nameOfBusinessCompany: string;
        formOfBusiness: string;
        businessCompanyOrigin: string;
        district: string;
        country: string;
        tinNumber: string;
      };
      addressInformation: {
        postalAddress: string;
        primaryEmail: string;
        alternateEmail: string;
        mobilePhone: string;
        telephone: string;
        fax: string;
        website: string;
      };
      contactPersons: {
        contactPersonsTable:
          | {
              firstName: string;
              lastName: string;
              email: string;
              mobileNumber: string;
              key: string;
            }[]
          | [];
      };
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
        shareHoldersTable:
          | {
              firstName: string;
              lastName: string;
              nationality: string;
              share: string;
              key: string;
            }[]
          | [];
      };
      beneficialOwnership: {
        beneficialOwnershipTable:
          | {
              firstName: string;
              lastName: string;
              nationality: string;
              key: string;
            }[]
          | [];
      };
      areasOfBusinessInterest: {
        areasOfBusinessInterestNames: string[] | [];
        areasOfBusinessInterestInformation:
          | {
              category: string;
              lineOfBusiness: string[];
              priceRange: string;
            }[]
          | [];
      };
      bankAccountDetails: {
        bankAccountDetailsTable:
          | {
              accountHoldersFullName: string;
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
            }[]
          | [];
      };
      supportingDocuments: {
        businessRegistration_IncorporationCertificate: string;
        mRA_TPINCertificate: string;
        generalReceipt_BankDepositSlip: string;
        mRATaxClearanceCertificate: string;
        previousPPDARegistrationCertificate: string;
        mSMECertificate: string;
      };
    };
  };
}

export interface FormSubmissionResponse {
  id: string;
  status: string;
  userId: string;
  tin: null | string;
  basicRegistration: {
    nameOfBusinessCompany: string;
    formOfBusiness: string;
    businessCompanyOrigin: string;
    district: string;
    country: string;
    tinNumber: string;
  };
  addressInformation: {
    postalAddress: string;
    primaryEmail: string;
    alternateEmail: string;
    mobilePhone: string;
    telephone: string;
    fax: string;
    website: string;
    geoLocation: {
      xCoordinate: string;
      yCoordinate: string;
    };
  };
  contactPersons: {
    contactPersonsTable: Array<{
      firstName: string;
      lastName: string;
      email: string;
      mobileNumber: string;
      key: string;
    }>;
  };
  businessSizeAndOwnership: {
    registeredCapital: {
      amount: string;
      currency: string;
    };
    paidUpCapital: {
      amount: string;
      currency: string;
    };
    numberOfEmployees: string; // This can be either string or number
    ownershipType: string;
  };
  shareHolders: {
    shareHoldersTable: Array<{
      id: string;
      firstName: string;
      lastName: string;
      nationality: string;
      share: string;
      key: string;
      createdBy: null | any;
      vendorId: string;
      updatedBy: null | any;
      deletedAt: null | any;
      deletedBy: null | any;
      createdAt: string;
      updatedAt: string;
    }>;
  };
  beneficialOwnership: {
    beneficialOwnershipTable: Array<{
      id: string;
      firstName: string;
      lastName: string;
      nationality: string;
      vendorId: string;
      createdBy: null | any;
      updatedBy: null | any;
      deletedAt: null | any;
      deletedBy: null | any;
      createdAt: string;
      updatedAt: string;
    }>;
  };
  areasOfBusinessInterest: {
    areasOfBusinessInterestNames: string[];
    areasOfBusinessInterestInformation: Array<{
      id: string;
      category: string;
      lineOfBusiness: string;
      priceRange: string;
      vendorId: string;
    }>;
  };
  bankAccountDetails: {
    bankAccountDetailsTable: Array<{
      id: string;
      AccountHolderFullName: string;
      AccountNumber: string | number; // This can be either string or number
      IBAN: string;
      bankSwift: string;
      bankId: null | string;
      bankName: string;
      branchAddress: string;
      branchName: string;
      currency: string;
      hashValue: string;
      status: string;
      createdBy: null | any;
      vendorId: string;
      updatedBy: null | any;
      deletedAt: null | any;
      deletedBy: null | any;
      accountHolderFullName: null | string;
      accountNumber: null | string;
      metaData: null | string;
      createdAt: string;
      updatedAt: string;
    }>;
  };
  supportingDocuments: {
    businessRegistration_IncorporationCertificate: string;
    mRA_TPINCertificate: string;
    generalReceipt_BankDepositSlip: string;
    mRATaxClearanceCertificate: string;
    previousPPDARegistrationCertificate: string;
    mSMECertificate: string;
  };
  instance: Array<{
    status: string;
    bpId: string;
    applicationNumber: string;
    createdBy: null | any;
    requestorId: string;
    updatedBy: null | any;
    deletedAt: null | any;
    deletedBy: null | any;
    pricingId: null | any;
    createdAt: string;
    updatedAt: string;
    id: string;
  }>;
}
export interface GetApplicationByUserIdResponse {
  id: string;
  tin: null | string;
  userId: string;
  country: string;
  name: string;
  status: 'Submitted' | 'Save as Draft';
  metaData: {
    addressInformation: {
      postalAddress: string;
      primaryEmail: string;
      alternateEmail: string;
      mobilePhone: string;
      telephone: string;
      fax: string;
      website: string;
      geoLocation: {
        xCoordinate: string;
        yCoordinate: string;
      };
    };
    supportingDocuments: {
      businessRegistration_IncorporationCertificate: string;
      mRA_TPINCertificate: string;
      generalReceipt_BankDepositSlip: string;
      mRATaxClearanceCertificate: string;
      previousPPDARegistrationCertificate: string;
      mSMECertificate: string;
    };
    areasOfBusinessInterest: {
      areasOfBusinessInterestNames: string[];
      areasOfBusinessInterestInformation: Array<{
        id: string;
        category: string;
        lineOfBusiness: string;
        priceRange: string;
        vendorId: string;
      }>;
      key: string;
    };
    businessSizeAndOwnership: {
      registeredCapital: {
        amount: number;
        currency: string;
      };
      paidUpCapital: {
        amount: number;
        currency: string;
      };
      numberOfEmployees: number;
      ownershipType: string;
    };
    contactPersons: {
      contactPersonsTable: Array<{
        firstName: string;
        lastName: string;
        email: string;
        mobileNumber: string;
        key: string;
      }>;
    };
  };
  district: string;
  origin: string;
  shareholders: Array<{
    id: string;
    vendorId: string;
    nationality: string;
    firstName: string;
    key: string;
    share: string;
  }>;
  bankAccountDetail: Array<{
    id: string;
    accountHolderFullName: null | string;
    accountNumber: null | string;
    vendorId: string;
    bankId: null | string;
    branchName: string;
    branchAddress: string;
    currency: string;
    bankSwift: string;
    IBAN: string;
    status: string;
    hashValue: string;
    bankName: string;
    metaData: null | string;
  }>;
  beneficialOwnership: Array<{
    id: string;
    firstName: string;
    lastName: string;
    nationality: string;
    vendorId: string;
    createdAt: string;
    createdBy: null | any;
    deletedAt: null | any;
    deletedBy: null | any;
    updatedAt: string;
    updatedBy: null | any;
  }>;
  areasOfBusinessInterest: Array<{
    id: string;
    category: string;
    lineOfBusiness: string;
    priceRange: string;
    vendorId: string;
  }>;
}

export interface BankListResponse {
  id: string;
  bankName: string;
  metaData: Record<string, any>; // You can use Record<string, any> for an empty object
}
export interface AreasOfBusinessInterestCategoriesListResponse {
  total: number;
  items: {
    id: string;
    code: string;
    description: string;
    businessArea: string;
    createdAt: string;
  }[];
}

export interface AreasOfBusinessInterestPriceRangeResponse {
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
