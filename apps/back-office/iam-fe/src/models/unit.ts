export interface Unit {
  isActive: string | boolean;
  id: string;
  name: string;
  shortName: string;
  code?: string | null;
  description: string;
  typeId: string;
  parentId: string;
  organizationId: string;
}
