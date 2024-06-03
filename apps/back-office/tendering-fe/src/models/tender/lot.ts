export interface Lot {
  id: string;
  tenderId: string;
  number: string;
  name: string;
  status: LotStatusEnum;
  metadata: { [data: string]: any };
}

export enum LotStatusEnum {
  ACTIVE = 'ACTIVE',
  CANCELED = 'CANCELED',
  RE_ADVERTISED = 'RE-ADVERTISED',
}
