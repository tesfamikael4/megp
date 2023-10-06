import { Service } from './service';

export interface Price {
  id: string;
  serviceId: string;
  businessArea: string;
  valueFrom: string;
  valueTo: string;
  currency: string;
  fee: string;
  service: Service;
}
