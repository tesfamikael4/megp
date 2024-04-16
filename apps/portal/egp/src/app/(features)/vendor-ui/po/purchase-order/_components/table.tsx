import { DataTable } from 'mantine-datatable';
import 'mantine-datatable/styles.layer.css';

const companies = [
  {
    id: '1323addd-a4ac-4dd2-8de2-6f934969a0f1',
    name: 'Sanitary Item',
    description: 'Toilet paper 100gm	',
    unit: 'Pcs',
    requestedQuantity: 1000,
    respondedQuantity: 500,
    remark: 'Yes',
  },
  {
    id: '1323addd-a4ac-4dd2-8de2-6f934969a0f1',
    name: 'Sanitary Item',
    description: 'Toilet paper 100gm	',
    unit: 'Pcs',
    requestedQuantity: 1000,
    respondedQuantity: 500,
    remark: 'No',
  },
];

const records = companies.slice(0, 5);

export type Company = {
  id: string;
  name: string;
  description: string;
  unit: string;
  requestedQuantity: number;
  respondedQuantity: number;
  remark: string;
};

export default function Table() {
  return (
    <DataTable
      verticalSpacing="sm"
      highlightOnHover
      height="auto"
      rowBackgroundColor={(record, index) => {
        if (index % 2 !== 0) return '#e7f4f7';
      }}
      columns={[
        { accessor: 'name' },
        { accessor: 'description' },
        { accessor: 'unit' },
        { accessor: 'requestedQuantity', textAlign: 'center' },
        { accessor: 'respondedQuantity', textAlign: 'center' },
        {
          accessor: 'remark',
          textAlign: 'center',
        },
      ]}
      records={records}
      styles={{
        header: {
          backgroundColor: '#e8e8e8',
        },
      }}
    />
  );
}
