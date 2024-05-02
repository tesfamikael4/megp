import { GetFormResponse } from '@/models/vendorRegistration';

export const formData: any = {
  status: '',
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
    registrationNumber: '',
    registrationIssuedDate: '',
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
  invoice: null,
  preferential: [],
  supportingDocuments: {
    businessRegistration_IncorporationCertificate: '',
    mRA_TPINCertificate: '',
    generalReceipt_BankDepositSlip: '',
    mRATaxClearanceCertificate: '',
    previousPPDARegistrationCertificate: '',
    MSMECertificate: '',
    ibmCertificate: '',
    marginalizedCertificate: '',
  },
  paymentReceipt: null,
  businessAreas: [],
};
