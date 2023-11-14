const initialValueSchema = {
  id: '',
  status: '',
  userId: '',
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
    geoLocation: { xCoordinate: '', yCoordinate: '' },
  },
  contactPersons: {
    contactPersonsTable: [{}],
  },
  businessSizeAndOwnership: {
    registeredCapital: { amount: '', currency: '' },
    paidUpCapital: { amount: '', currency: '' },
    numberOfEmployees: '',
    ownershipType: '',
  },
  shareHolders: {
    shareHoldersTable: [
      {
        firstName: '',
        lastName: '',
        nationality: '',
        share: '',
        key: '',
      },
    ],
  },
  beneficialOwnership: {
    beneficialOwnershipTable: [
      { firstName: '', lastName: '', nationality: '', key: '' },
    ],
  },
  areasOfBusinessInterest: {
    areasOfBusinessInterestNames: [],
    areasOfBusinessInterestInformation: [
      {
        category: 'string',
        lineOfBusiness: 'string',
        priceRange: 'string',
      },
    ],
  },
  bankAccountDetails: {
    bankAccountDetailsTable: [
      {
        accountHoldersFullName: 'string',
        accountNumber: '',
        bankBranchAddress: 'string',
        currency: 'string',
        bankSWIFT_BICCode: 'string',
        iBAN: 'string',
        status: 'string',
        bankId: 'string',
        bankName: 'string',
        hashValue: 'string',
        branchName: 'string',
      },
    ],
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

export default initialValueSchema;
