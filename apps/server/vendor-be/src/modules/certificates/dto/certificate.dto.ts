export interface CertificateData {
  label: string;
  value: string;
}

export class CertificateDTO {
  id: string;
  data: CertificateData[];
}
