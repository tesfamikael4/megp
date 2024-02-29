export interface OrganizationProfile {
  id: string;
  organizationId: string;
  country?: string;
  region: string;
  district: string;
  zoneOrSubCity?: string;
  city?: string;
  street?: string;
  houseNumber?: string;

  telephone?: {
    countyCode?: string;
    number?: string;
  };
  fax?: {
    countyCode?: string;
    number?: string;
  };
  email?: string | null;
  postalCode?: string;
}
