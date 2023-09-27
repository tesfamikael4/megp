export const initialValues = {
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
    beneficialOwnershipTable: [
      // { firstName: '', lastName: '', nationality: '' },
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
};
