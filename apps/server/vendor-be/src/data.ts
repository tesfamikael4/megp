const initialValueSchema = {
  id: '',
  status: '',
  userId: '',
  tin: '',
  basicRegistration: {
    nameOfBusinessCompany: '',
    formOfBusiness: '',
    businessCompanyOrigin: '',
    district: '',
    country: '',
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
    contactPersonsTable: 'contactPersonsTableExamples',
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
      { firstName: '', lastName: '', nationality: '' },
    ],
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
  instance: {},
};

export default initialValueSchema;
