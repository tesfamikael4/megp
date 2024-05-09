export interface JvMembers {
  vendorId: string;
  name: string;
  countryOfRegistration: string;
  yearOfRegistration: string;
  address: JvMembersAddress;
  authorizedPersons: JvMembersAuthorizedPerson;
}

export interface JvMembersAddress {
  physicalAddress: string;
  city: string;
  district: string;
  country: string;
  telephone: string;
  fax: string;
  primaryEmail: string;
}
export interface JvMembersAuthorizedPerson {
  fullName: string;
  position: string;
  email: string;
  telephone: string;
}
