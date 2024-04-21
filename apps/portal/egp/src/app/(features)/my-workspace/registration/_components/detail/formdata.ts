import { GetFormResponse } from '@/models/vendorRegistration';

export const formData: GetFormResponse = {
  status: '',
  initial: {
    level: '',
    status: '',
    userId: '',
  },
  basic: {
    name: '',
    countryOfRegistration: '',
    tinNumber: '',
    businessType: '',
    tinIssuedDate: '',
    registrationNumber: '',
    registrationIssuedDate: '',
  },
  address: {
    physicalAddress: '',
    postalAddress: '',
    primaryEmail: '',
    region: '',
    district: '',
    alternateEmail: '',
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
    // ownershipType: '',
  },
  beneficialOwnershipShareholders: [],
  bankAccountDetails: [],
  areasOfBusinessInterest: [],
  lineOfBusiness: [],
  invoice: null,
  preferential: [],
  supportingDocuments: {
    businessRegistration_IncorporationCertificate: '',
    mRA_TPINCertificate: '',
    generalReceipt_BankDepositSlip: '',
    mRATaxClearanceCertificate: '',
    previousPPDARegistrationCertificate: '',
  },
  paymentReceipt: null,
  businessAreas: [],
};
