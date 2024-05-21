export interface JvMembers extends JvMembersAddress {
  vendorId: string;
  name: string;
  countryOfRegistration: string;
  registrationIssuedDate: string;
  yearOfRegistration: string;
  authorizedPersons: JvMembersAuthorizedPerson;
}

export interface JvMembersAddress {
  physicalAddress: string;
  city: string;
  district: string;
  country: string;
  region: string;
  telephone: string;
  fax: string;
  primaryEmail: string;
  postalAddress: string;
}
export interface JvMembersAuthorizedPerson {
  fullName: string;
  position: string;
  email: string;
  telephone: string;
}
