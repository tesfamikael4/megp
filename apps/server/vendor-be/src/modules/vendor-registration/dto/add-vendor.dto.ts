
const InitialValueSchema = {
  initial: {
    id: '',
    userId: 'b23f0b00-0a59-4f6d-9fd9-34d6fa960e0f', //session
    status: 'Submit',
    level: 'ppda',
  },
  basic: {
    name: '',
    businessType: '',
    district: '',
    tinNumber: '',
    countryOfRegistration: '',
    isrVendorId: '',
  },
  address: {
    physicalAddress: '',
    region: '',
    district: '',
    primaryEmail: '',
    alternateEmail: '',
    postalCode: '',
    mobile: '',
    telephone: '',
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

  beneficialOwnershipAndShareholders: [
    {
      firstName: '',
      middleName: '',
      lastName: '',
      countryOfResidence: '',
      nationality: '',
      share: '',
      votingRights: '',
      authorityToAppointGov: ''
    },
  ],



  bankAccountDetails: [
    {
      accountHolderFullName: '',
      accountNumber: 0,
      accountType: '',
      currency: '',
      swiftCode: '',
      bankName: '',
      branchName: '',
      branchAddress: '',
      IBAN: '',
      status: '',
      bankId: '',
      hashValue: '',
      isDefualt: true,
    },
  ],
  //ppdA schema
  areasOfBusinessInterest: [
    {
      category: '',
      lineOfBusiness: [],
      priceId: '',
      userType: '',//Contractor, Consultant
      classification: '',// Classification of Contractor or consultants
      activationDate: '',
      expiryDate: ''
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
      payToAccName: '',
      payToAccNo: '1',
      payToBank: '',
      payerAccountId: '',
      payerName: '',
      createdOn: '',
      serviceName: '',
      paymentStatus: '',
      remark: '',
      amount: '',
    },
  ],
  lineOfBusiness: [
    { id: '', name: '' }

  ],
  supportingDocuments: {
    businessRegistration_IncorporationCertificate: '',
    mRA_TPINCertificate: '',
    generalReceipt_BankDepositSlip: '',
    mRATaxClearanceCertificate: '',
    previousPPDARegistrationCertificate: '',
    MSMECertificate: '',
    ibmCertificate: '',
    marginalizedCertificate: ''
  },
  preferential: [
    {
      category: '',
      serviceId: '',
      type: '',
      certificateValidityPeriod: '',
      certificateIssuanceDate: '',
    }
  ]
};
export default InitialValueSchema;
