export interface Notification {
  organizationName: string;
  description: string;
  type?: 'success' | 'warning' | 'error';
}
