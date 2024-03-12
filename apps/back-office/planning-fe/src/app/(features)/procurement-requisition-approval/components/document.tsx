import { TableConfig, Table } from '@megp/core-fe';

const config: TableConfig<any> = {
  columns: [
    {
      id: 'name',
      header: 'Name',
      accessorKey: 'name',
    },
  ],
};
export const Document = () => {
  return <Table data={[]} config={config} />;
};
