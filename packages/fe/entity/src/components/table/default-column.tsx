export interface TableMeta {
  updateData: (rowIndex: number, columnId: string, value: unknown) => void;
}
