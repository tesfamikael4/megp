import { Box, Text } from '@mantine/core';
import { DataTable } from 'mantine-datatable';

export const DetailQualification = ({ cell }: any) => {
  const data = [
    {
      key: 'The Criterion to be created shall not be modified by a Procuring Entity',
      value: cell.isRequired ? 'Yes' : 'No',
    },
    {
      key: 'Factor',
      value: cell.factor,
    },
    {
      key: 'Criterion / Requirement',
      value: cell.requirement,
    },
    {
      key: 'Data Field from ITB',
      value: cell.attribute,
    },
    {
      key: 'ITB Reference',
      value: cell.reference,
    },
    {
      key: 'ITB Description',
      value: cell.itbDescription,
    },
    {
      key: 'Bid Form Link',
      value: cell.formLink,
    },
  ];
  return (
    <>
      <Box className="bg-white p-5" pos="relative">
        <Text className="font-semibold my-4">Definition</Text>
        <DataTable
          withColumnBorders
          withTableBorder
          records={data}
          columns={[{ accessor: 'key', width: 400 }, { accessor: 'value' }]}
          noHeader
        />
      </Box>{' '}
    </>
  );
};
