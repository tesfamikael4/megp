import { GetFormResponse } from '@/models/vendorRegistration';

export const formData: GetFormResponse = {
  initial: {
    level: '',
    status: '',
    userId: '',
  },
  basic: {
    name: '',
    origin: '',
    tinNumber: '',
    businessType: '',
    tinIssuedDate: '',
  },
  address: {
    postalAddress: '',
    primaryEmail: '',
    alternateEmail: '',
    mobilePhone: '',
    telephone: '',
    fax: '',
    website: '',
  },
  contactPersons: [],
  businessSizeAndOwnership: {
    registeredCapital: {
      amount: '',
      currency: '',
    },
    paidUpCapital: {
      amount: '',
      currency: '',
    },
    numberOfEmployees: '',
    ownershipType: '',
  },
  shareHolders: [],
  beneficialOwnership: [],
  bankAccountDetails: [],
  areasOfBusinessInterest: [],
  invoice: [],
  supportingDocuments: {
    businessRegistration_IncorporationCertificate: '',
    mRA_TPINCertificate: '',
    generalReceipt_BankDepositSlip: '',
    mRATaxClearanceCertificate: '',
    previousPPDARegistrationCertificate: '',
    mSMECertificate: '',
  },
  paymentReceipt: null,
};
