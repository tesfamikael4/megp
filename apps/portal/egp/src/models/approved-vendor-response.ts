export interface ApprovedVendorResponse {
  id: string;
  tin: string;
  userId: string;
  status: string;
  formOfEntity: string;
  metaData: MetaData;
  name: string;
  origin: string;
  areasOfBusinessInterest: AreasOfBusinessInterest[];
  shareholders: Shareholder[];
  beneficialOwnership: BeneficialOwnership[];
  vendorAccounts: VendorAccount[];
}

export interface MetaData {
  address: Address;
  contactPersons: ContactPerson[];
  businessSizeAndOwnership: BusinessSizeAndOwnership;
  supportingDocuments: SupportingDocuments;
  paymentReceipt: PaymentReceipt;
}

export interface Address {
  fax: string;
  website: string;
  telephone: string;
  mobilePhone: string;
  primaryEmail: string;
  postalAddress: string;
  alternateEmail: string;
}

export interface ContactPerson {
  email: string;
  lastName: string;
  firstName: string;
  mobileNumber: string;
}

export interface BusinessSizeAndOwnership {
  ownershipType: string;
  paidUpCapital: PaidUpCapital;
  numberOfEmployees: string;
  registeredCapital: RegisteredCapital;
}

export interface PaidUpCapital {
  amount: string;
  currency: string;
}

export interface RegisteredCapital {
  amount: string;
  currency: string;
}

export interface SupportingDocuments {
  mSMECertificate: string;
  mRA_TPINCertificate: string;
  mRATaxClearanceCertificate: string;
  generalReceipt_BankDepositSlip: string;
  previousPPDARegistrationCertificate: string;
  businessRegistration_IncorporationCertificate: string;
}

export interface PaymentReceipt {
  category: string;
  invoiceId: string;
  attachment: string;
  transactionId: string;
}

export interface AreasOfBusinessInterest {
  category: string;
  ValueRange: string;
  lineOfBusiness: string[][];
  approvedAt: string;
  expireDate: string;
  certificateUrl: string;
}

export interface Shareholder {
  firstName: string;
  lastName: string;
  nationality: string;
  share: string;
}

export interface BeneficialOwnership {
  firstName: string;
  lastName: string;
  nationality: string;
}

export interface VendorAccount {
  accountHolderFullName: string;
  accountNumber: string;
  branchName: string;
  branchAddress: string;
  currency: string;
  IBAN: string;
  status: string;
  bankName: string;
  isDefualt: boolean;
}
