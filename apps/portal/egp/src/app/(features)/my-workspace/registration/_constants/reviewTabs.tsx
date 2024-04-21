export const tab = [
  {
    tabValue: 'basic',
    tabName: 'Basic Registration',
  },
  {
    tabValue: 'address',
    tabName: 'Address Information',
  },
  {
    tabValue: 'contactPersons',
    tabName: 'Contact Persons',
  },
  {
    tabValue: 'businessSizeAndOwnership',
    tabName: 'Business Size and Ownership',
  },
  {
    tabValue: 'beneficialOwnershipShareholders',
    tabName: 'Beneficial Ownership/Shareholders',
  },
  {
    tabValue: 'bankAccountDetails',
    tabName: 'Bank Account Details',
  },
  {
    tabValue: 'vendorAccounts',
    tabName: 'Bank Account Details',
  },
  {
    tabValue: 'areasOfBusinessInterestView',
    tabName: 'Areas of Business Interest',
  },
  {
    tabValue: 'lineOfBusiness',
    tabName: 'Line Of Business',
  },
  {
    tabValue: 'supportingDocuments',
    tabName: 'Supporting Documents',
  },
  {
    tabValue: 'paymentReceipt',
    tabName: 'Payment Receipts',
  },
  {
    tabValue: 'preferential',
    tabName: 'Eligibility for Preferential Services',
  },
];

export const formatColumns = (countryOfRegistration) => ({
  basic: [
    { name: 'name', displayName: 'Name of Business Company' },
    { name: 'countryOfRegistration', displayName: 'Country of Registration' },
    { name: 'businessType', displayName: 'Form of Business' },
    { name: 'tinNumber', displayName: 'Taxpayer Identification Number' },
    { name: 'tinIssuedDate' },
    ...(countryOfRegistration === 'Malawi'
      ? [{ name: 'registrationNumber' }, { name: 'registrationIssuedDate' }]
      : []),
  ],
  address: [
    { name: 'physicalAddress', displayName: 'Physical Address' },
    { name: 'postalAddress', displayName: 'Postal Address' },
    { name: 'primaryEmail', displayName: 'Primary Email' },
    ...(countryOfRegistration === 'Malawi'
      ? [
          { name: 'region', displayName: 'Region' },
          { name: 'district', displayName: 'District' },
        ]
      : []),
    { name: 'alternateEmail', displayName: 'Alternate Email' },
    { name: 'telephone', displayName: 'Telephone' },
    { name: 'fax', displayName: 'Fax' },
    { name: 'website', displayName: 'Website' },
  ],
  areasOfBusinessInterestView: [{ name: 'category' }, { name: 'priceRange' }],

  businessSizeAndOwnership: [
    { name: 'registeredCapital' },
    { name: 'paidUpCapital' },
    { name: 'numberOfEmployees' },
  ],
  contactPersons: [
    { name: 'firstName' },
    { name: 'lastName' },
    { name: 'email' },
    { name: 'mobileNumber' },
  ],
  beneficialOwnershipShareholders: [
    { name: 'firstName' },
    { name: 'middleName' },
    { name: 'lastName' },
    { name: 'nationality' },
    { name: 'countryOfResidence' },
    { name: 'share' },
    { name: 'votingRights' },
  ],

  bankAccountDetails: [
    { name: 'bankType' },
    { name: 'accountType', displayName: 'Account Type' },
    { name: 'accountHolderFullName', displayName: 'fullName' },
    { name: 'accountNumber' },
    { name: 'bankName' },
    { name: 'branchName' },
    { name: 'branchAddress' },
    { name: 'IBAN' },
    { name: 'isDefualt' },
  ],

  service: [{ name: 'name', displayName: 'Service Type' }],
  preferential: [
    { name: 'type', displayName: 'Preferential Service' },
    { name: 'certiNumber', displayName: 'Certificate Number' },
    { name: 'certificateValidityPeriod', displayName: 'Validity Period' },
    { name: 'certificateIssuedDate', displayName: 'Issued Date' },
  ],
});
