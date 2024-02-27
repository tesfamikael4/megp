export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  username: string;
  status: string;
  isActive: boolean | string;
  organizationId: string;
  account: any;

  fullName: string;
}
