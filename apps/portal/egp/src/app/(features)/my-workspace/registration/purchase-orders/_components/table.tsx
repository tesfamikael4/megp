'use client';
import { DataTable } from 'mantine-datatable';
import { Badge } from '@mantine/core';
import { useRouter } from 'next/navigation';

const companies = [
  {
    id: '1323addd-a4ac-4dd2-8de2-6f934969a0f1',
    name: 'REMEDICA',
    description: '21716 Ratke Drive',
    status: 'Submitted',
  },
  {
    id: '1323addd-a4ac-4dd2-8de2-6f934969a0f1',
    name: 'Reyoung pharmaceutical',
    description: '21716 Ratke Drive',
    status: 'Requested',
  },
  {
    id: '1323addd-a4ac-4dd2-8de2-6f934969a0f1',
    name: 'Cipla',
    description: '21716 Ratke Drive',
    status: 'Requested',
  },
  {
    id: '1323addd-a4ac-4dd2-8de2-6f934969a0f1',
    name: 'Sun pharma',
    description: '21716 Ratke Drive',
    status: 'Submitted',
  },
  {
    id: '1323addd-a4ac-4dd2-8de2-6f934969a0f1',
    name: 'Cipla',
    description: '21716 Ratke Drive',
    status: 'Requested',
  },
  {
    id: '1323addd-a4ac-4dd2-8de2-6f934969a0f1',
    name: 'Sun pharma',
    description: '21716 Ratke Drive',
    status: 'Submitted',
  },
  {
    id: '1323addd-a4ac-4dd2-8de2-6f934969a0f1',
    name: 'Cipla',
    description: '21716 Ratke Drive',
    status: 'Requested',
  },
  {
    id: '1323addd-a4ac-4dd2-8de2-6f934969a0f1',
    name: 'Sun pharma',
    description: '21716 Ratke Drive',
    status: 'Submitted',
  },
];

const records = companies.slice(0, 5);

export type Company = {
  id: string;
  name: string;
  description: string;
  status: string;
};

export default function Table() {
  const router = useRouter();
  return (
    <DataTable
      verticalSpacing="sm"
      highlightOnHover
      rowBackgroundColor={(record, index) => {
        if (index % 2 !== 0) return '#e7f4f7';
      }}
      columns={[
        { accessor: 'name' },
        { accessor: 'description' },
        {
          accessor: 'status',
          textAlign: 'center',
          render: ({ status }) => (
            <Badge
              color={status === 'Submitted' ? 'green' : '#F4A403'}
              variant="light"
              fw={700}
              radius={'sm'}
            >
              {status}
            </Badge>
          ),
        },
      ]}
      records={records}
      onRowClick={() => {
        router.push('/my-workspace/po/purchase-order');
      }}
      styles={{
        header: {
          backgroundColor: '#e8e8e8',
        },
      }}
    />
  );
}
