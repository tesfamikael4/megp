'use client';
import React from 'react';
import { Badge, Box } from '@mantine/core';
import { IconBoxOff } from '@tabler/icons-react';
import { DataTable } from 'mantine-datatable';
import { useRouter } from 'next/navigation';

export default function Table({ data }: any) {
  const router = useRouter();
  const handleRowClick = (record) => {
    router.push(`/vendor/my-tenders/guarantee/${record?.id}`);
  };
  const transformedData = data?.items?.map((data: any) => {
    return {
      lotName: 'lotName',
      procuringEntity: 'procuringEntity',
      createdAt: data?.createdAt,
      status: data?.status,
      id: data?.id,
    };
  });

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
        { accessor: 'createdAt' },
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
      records={transformedData}
      onRowClick={({ record }) => {
        handleRowClick(record);
      }}
      noRecordsText="No Data"
      styles={{
        header: {
          backgroundColor: '#e8e8e8',
        },
      }}
    />
  );
}
