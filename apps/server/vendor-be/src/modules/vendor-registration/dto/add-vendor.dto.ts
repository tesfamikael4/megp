import { IsDate } from 'class-validator';

const initialValueSchema = {
  initial: {
    id: '',
    userId: 'b23f0b00-0a59-4f6d-9fd9-34d6fa960e0f', //session
    status: 'Submit',
    level: 'ppda',
  },
  basic: {
    name: '',
    businessType: '',
    origin: '',
    district: '',
    country: '',
    tinNumber: '',
  },
  address: {
    postal: '',
    primaryEmail: '',
    alternateEmail: '',
    mobile: '',
    phone: '',
    fax: '',
    website: '',
  },
  contactPersons: [
    {
      firstName: '',
      lastName: '',
      email: '',
      mobileNumber: '',
    },
  ],
  businessSizeAndOwnership: {
    registeredCapital: {
      amount: '',
      currency: '',
    },
    paidUpCapital: {
      amount: 0,
      currency: '',
    },
    numberOfEmployees: '',
    ownershipType: '',
  },
  shareHolders: [
    {
      firstName: '',
      lastName: '',
      nationality: '',
      share: '',
    },
  ],
  beneficialOwnership: [
    {
      firstName: '',
      lastName: '',
      nationality: '',
    },
  ],

  bankAccountDetails: [
    {
      accountHolderFullName: '',
      accountNumber: 0,
      branchAddress: '',
      currency: '',
      bankSwift: '',
      IBAN: '',
      status: '',
      bankId: '',
      bankName: '',
      hashValue: '',
      branchName: '',
      accountType: '',
      isDefualt: true,
    },
  ],
  areasOfBusinessInterest: [
    {
      category: '',
      lineOfBusiness: [],
      priceId: '',
    },
    {
      category: '',
      lineOfBusiness: ['', '', ''],
      priceRange: '',
    },
    {
      category: '',
      lineOfBusiness: [''],
      priceRange: '',
    },
  ],
  invoice: [
    {
      id: '',
      instanceId: '',
      applicationNo: '',
      taskId: '',
      taskName: '',
      payToAccName: '',
      payToAccNo: '1',
      payToBank: '',
      payerAccountId: '',
      payerName: '',
      createdOn: Date,
      serviceName: '',
      paymentStatus: '',
      remark: '',
      amount: '',
    },
  ],
  supportingDocuments: {
    businessRegistration_IncorporationCertificate: '',
    mRA_TPINCertificate: '',
    generalReceipt_BankDepositSlip: '',
    mRATaxClearanceCertificate: '',
    previousPPDARegistrationCertificate: '',
    mSMECertificate: '',
  },
};
export default initialValueSchema;
