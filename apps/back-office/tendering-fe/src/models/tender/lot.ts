export interface Lot {
  id: string;
  tenderId: string;
  number: string;
  name: string;
  metadata: { [data: string]: any };
}
