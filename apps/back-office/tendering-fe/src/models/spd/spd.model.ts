export interface Spd {
  id: string;
  name: string;
  description?: string;
  isActive: boolean | string;
  marketType: 'international' | 'national';
  procurementCategory: 'goods' | 'works' | 'consultancy' | 'non-consultancy';
}
