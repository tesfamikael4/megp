export interface SpdPreferenceMargin {
  id: string;
  spdId: string;
  condition: string;
  description: string;
  margin: number;
  itbReference: string;
  itbDescription?: string;
}
