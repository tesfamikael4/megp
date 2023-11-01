import { IsDate } from 'class-validator';

const initialValueSchema2 = {
  id: '',
  userId: 'b23f0b00-0a59-4f6d-9fd9-34d6fa960e0f', //session
  status: '',
  level: '',
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
      accountHoldersFullName: '',
      accountNumber: 0,
      bankBranchAddress: '',
      currency: '',
      bankSWIFT_BICCode: '',
      iBAN: '',
      status: '',
      bankId: '',
      bankName: '',
      hashValue: '',
      branchName: '',
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
};
export default initialValueSchema2;
