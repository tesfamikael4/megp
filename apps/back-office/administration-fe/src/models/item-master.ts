export interface ItemMaster {
  description: string;
  commodityCode: string;
  commodityName: string;
  itemSubcategoryName: string;
  uOMId: string | null;
  uOMName: string | null;
  isActive: boolean;
  itemCode: string;
  id: string;
  itemSubcategoryId: string;
  measurementId: string | null;
  itemTags: string[];
}
