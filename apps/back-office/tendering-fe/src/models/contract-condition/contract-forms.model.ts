export interface GeneralProvisionForm {
  id: string;
  contractDuration: number;
  commencementDay: number;
  deliverySite: string;
  contractType: ContractTypeEnum;
}

export enum ContractTypeEnum {
  ITEM_WISE = 'item wise',
  LUMP_SUM = 'lump sum',
  TURN_KEY = 'turn key',
  TIME_AND_MATERIAL = 'time and material',
}
