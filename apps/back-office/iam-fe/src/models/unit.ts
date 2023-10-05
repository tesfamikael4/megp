export interface Unit {
  isActive: string | boolean;
  id: string;
  name: string;
  code?: string | null;
  description: string;
  typeId: string;
  parentId: string;
  organizationId: string;
}
