'use client';

import { Badge, Box } from '@mantine/core';
import { IconBoxOff } from '@tabler/icons-react';
import { DataTable } from 'mantine-datatable';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
export type Company = {
  id: string;
  lotName: string;
  procuringEntity: string;
  date: string;
  status: string;
};

export default function Table({ data }: { data: any[] }) {
  const [status] = useState('Accepted');
  const router = useRouter();
  const handleRowClick = () => {
    router.push('/vendor/my-tenders/guarantee/detail');
  };
  return (
    <DataTable
      height="665px"
      striped
      verticalSpacing="sm"
      highlightOnHover
      rowBackgroundColor={(record, index) => {
        if (index % 2 !== 0) return '#e7f4f7';
      }}
      columns={[
        { accessor: 'lotName' },
        { accessor: 'procuringEntity' },
        { accessor: 'date' },
        {
          accessor: 'status',
          render: ({ status }) => (
            <Badge
              color={status === 'Accepted' ? 'green' : 'red'}
              variant="light"
              fw={700}
              radius={'sm'}
            >
              {status}
            </Badge>
          ),
        },
      ]}
      noRecordsIcon={
        <Box p={4} mb={4}>
          <IconBoxOff />
        </Box>
      }
      records={data}
      onRowClick={handleRowClick}
      noRecordsText="No Data"
      styles={{
        header: {
          backgroundColor: '#e8e8e8',
        },
      }}
    />
  );
}
