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
    tabValue: 'shareHolders',
    tabName: 'Shareholders',
  },
  {
    tabValue: 'beneficialOwnership',
    tabName: 'Beneficial Ownership',
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
    tabValue: 'customCats',
    tabName: 'Custom Categories',
  },
  {
    tabValue: 'businessCats',
    tabName: 'Business Categories',
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

export const formatColumns = {
  basic: [
    { name: 'name', displayName: 'Name of Business Company' },
    { name: 'origin', displayName: 'Country of Registration' },
    { name: 'businessType', displayName: 'Form of Business' },
    { name: 'tinNumber', displayName: 'Taxpayer Identification Number' },
    { name: 'district', displayName: 'District' },
    { name: 'tinIssuedDate' },
  ],
  businessSizeAndOwnership: [
    { name: 'registeredCapital' },
    { name: 'paidUpCapital' },
    { name: 'numberOfEmployees' },
    { name: 'ownershipType' },
  ],
  contactPersons: [
    { name: 'firstName' },
    { name: 'lastName' },
    { name: 'email' },
    { name: 'mobileNumber' },
  ],
  beneficialOwnership: [
    { name: 'firstName' },
    { name: 'lastName' },
    { name: 'nationality' },
  ],

  businessAreas: [
    { name: 'category' },
    { name: 'priceFrom' },
    { name: 'priceTo' },
    { name: 'currency' },
    { name: 'approvedAt', displayName: 'Approved On' },
    { name: 'expireDate', displayName: 'Expiry Date' },
    { name: 'certificateUrl', displayName: 'Certificate URL' },
  ],
  bankAccountDetails: [
    { name: 'accountHolderFullName', displayName: 'fullName' },
    { name: 'accountNumber' },
    { name: 'bankName' },
    { name: 'branchName' },
    { name: 'branchAddress' },
    { name: 'IBAN' },
    { name: 'isDefualt' },
  ],
  shareHolders: [
    { name: 'firstName' },
    { name: 'lastName' },
    { name: 'nationality' },
    { name: 'share' },
  ],

  service: [{ name: 'name', displayName: 'Service Type' }],
  preferential: [
    { name: 'type', displayName: 'Preferential Service' },
    { name: 'certiNumber', displayName: 'Certificate Number' },
    { name: 'certificateUrl', displayName: 'Certificate' },
  ],
};
