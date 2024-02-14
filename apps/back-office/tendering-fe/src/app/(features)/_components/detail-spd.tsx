import { Box, Text } from '@mantine/core';
import { DetailTable } from './detail-table';
import { DataTable } from 'mantine-datatable';

export const DetailSpd = ({ cell }: any) => {
  const data = [
    {
      key: 'Name',
      value: cell.name,
    },
    {
      key: 'Description',
      value: cell.description,
    },
    {
      key: 'Procurement Language',
      value: cell.language,
    },
    {
      key: 'Procurement Category',
      value: cell.procurementCategory,
    },
    {
      key: 'Procurement Tool',
      value: cell.procurementTool,
    },
    {
      key: 'Contracting Method',
      value: cell.contractingMethod,
    },
    {
      key: 'Market Type',
      value: cell.marketType,
    },
  ];
  return (
    <>
      <Box className="bg-white p-5" pos="relative">
        <Text className="font-semibold mb-2">Definition</Text>
        <DataTable
          withColumnBorders
          withTableBorder
          records={data}
          columns={[{ accessor: 'key', width: 200 }, { accessor: 'value' }]}
          noHeader
        />
      </Box>{' '}
    </>
  );
};
