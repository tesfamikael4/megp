export const initialValues: InitialValues = {
  basicRegistration: {
    nameOfBusinessCompany: '',
    formOfBusiness: '',
    businessCompanyOrigin: '',
    district: '',
    country: '',
    tinNumber: '',
  },
  addressInformation: {
    postalAddress: '',
    primaryEmail: '',
    alternateEmail: '',
    mobilePhone: '',
    telephone: '',
    fax: '',
    website: '',
  },
  contactPersons: {
    contactPersonsTable: [],
  },
  businessSizeAndOwnership: {
    registeredCapital: { amount: '', currency: '' },
    paidUpCapital: { amount: '', currency: '' },
    numberOfEmployees: '',
    ownershipType: '',
  },
  shareHolders: {
    shareHoldersTable: [],
  },
  beneficialOwnership: {
    beneficialOwnershipTable: [],
  },
  areasOfBusinessInterest: {
    areasOfBusinessInterestNames: [],
    areasOfBusinessInterestInformation: [],
  },
  bankAccountDetails: {
    bankAccountDetailsTable: [],
  },
  supportingDocuments: {
    businessRegistration_IncorporationCertificate: '',
    mRA_TPINCertificate: '',
    generalReceipt_BankDepositSlip: '',
    mRATaxClearanceCertificate: '',
    previousPPDARegistrationCertificate: '',
    mSMECertificate: '',
  },
};
export interface InitialValues {
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
}
