export const accordionTabs = (countryOfRegistration: string) => [
  {
    tabValue: 'basic',
    tabName: 'Basic Registration',
  },
  {
    tabValue: 'address',
    tabName: 'Company Address Information',
  },
  {
    tabValue: 'contactPersons',
    tabName: 'Contact Persons Information',
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
    tabValue: 'areasOfBusinessInterest',
    tabName: 'Purpose of Registration',
  },
  {
    tabValue: 'lineOfBusiness',
    tabName: 'Line Of Business',
  },
  ...(countryOfRegistration === 'Malawi'
    ? [
        {
          tabValue: 'preferential',
          tabName: 'Eligibility for Preferential Services',
        },
      ]
    : []),
  {
    tabValue: 'paymentReceipt',
    tabName: 'Payment Receipts',
  },
  {
    tabValue: 'supportingDocuments',
    tabName: 'Supporting Documents',
  },
];

export const formatColumns = (countryOfRegistration) => ({
  ...(countryOfRegistration === 'Malawi'
    ? {
        newPreferential: [
          { name: 'type', displayName: 'Preferential Service' },
          { name: 'certiNumber', displayName: 'Certificate Number' },
          { name: 'certificateUrl', displayName: 'Certificate' },
        ],
      }
    : {}),
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
    { name: 'authorityToAppointGov' },
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
  ...(countryOfRegistration === 'Malawi'
    ? {
        preferential: [
          { name: 'type', displayName: 'Preferential Service' },
          { name: 'certiNumber', displayName: 'Certificate Number' },
        ],
      }
    : {}),
});
