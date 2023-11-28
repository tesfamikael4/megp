export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  status: string;
  isActive: boolean | string;
  organizationId: string;

  fullName: string;
}
