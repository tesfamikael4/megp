interface UOM {
  id: string;
  category: string;
  name: string;
  description: string;
}
interface Category {
  id: string;
  name: string;
  description: string;
}
interface Method {
  id: string;
  name: string;
  description: string;
}
export interface Contract {
  id: string;
  contractId: string;
  contractNo: string;
  quantity: number;
  price: number;
}
export interface Item {
  id: string;
  prebudgetId: string;
  itemCodeReferenceType: string;
  itemCode: string;
  itemCodeDescription: string;
  itemSpecification: string;
  price: string;
  quantity: string;
  uOMId: string;
  uOM: UOM;
  indigenousPreference: boolean;
  MSME: string;
  marginalizedGroups: string;
  currency: string;
  procurementCategoryId: string;
  procurementCategory: Category;
  procurementMethodId: string;
  procurementMethod: Method;
  procurementStatus: string;
  frameworkContractId: string;
  frameworkContract: Contract;
  fundingSource: string;
  donorName: string;
  donorId: string;
}
