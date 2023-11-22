import { UserRole } from './user-role';
import { UserUnit } from './user-unit';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  status: string;
  isActive: boolean | string;
  organizationId: string;
  userRoles?: UserRole[];
  userUnits?: UserUnit[];
  fullName: string;
}
