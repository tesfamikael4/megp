export interface ItemMaster {
  description: string;
  commodityCode: string;
  commodityName: string;
  uOMId: string | null;
  uOMName: string;
  isActive: boolean;
  itemCode: string;
  id: string;
  measurementId: string | null;
  itemTags: string[];
  itemCategoryId: string | null;
  itemSubCategoryId: string;
}
