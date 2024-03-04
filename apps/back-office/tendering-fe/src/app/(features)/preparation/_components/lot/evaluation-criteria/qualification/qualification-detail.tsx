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
  const singleBidder = [
    {
      key: 'Requirement for a Single Bidder',
      value: cell.singleEntityCondition.value,
    },
    {
      key: 'Additional Requirement',
      value: cell.singleEntityCondition.additionalRequirements,
    },
  ];
  const jvCominedCondition = [
    {
      key: 'Jv combined condition',
      value: cell.jvCombinedPartnerCondition.value,
    },
    {
      key: 'Additional Requirement',
      value: cell.jvCombinedPartnerCondition.additionalRequirements,
    },
  ];
  const jvEachPartherCondition = [
    {
      key: 'Jv each partner condition',
      value: cell.jvEachPartnerCondition.value,
    },
    {
      key: 'Additional Requirement',
      value: cell.jvEachPartnerCondition.additionalRequirements,
    },
  ];
  const jvAtleastOnePartnerCondition = [
    {
      key: 'Jv at least one partner condition',
      value: cell.jvAtleastOnePartnerCondition.value,
    },
    {
      key: 'Additional Requirement',
      value: cell.jvAtleastOnePartnerCondition.additionalRequirements,
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

        <Text className="font-semibold my-4">
          Requirement for a Single Bidder
        </Text>
        <DataTable
          withColumnBorders
          withTableBorder
          records={singleBidder}
          columns={[{ accessor: 'key', width: 400 }, { accessor: 'value' }]}
          noHeader
        />
        <Text className="font-semibold my-4">Jv combined condition</Text>
        <DataTable
          withColumnBorders
          withTableBorder
          records={jvCominedCondition}
          columns={[{ accessor: 'key', width: 400 }, { accessor: 'value' }]}
          noHeader
        />
        <Text className="font-semibold my-4">Jv each partner condition</Text>
        <DataTable
          withColumnBorders
          withTableBorder
          records={jvEachPartherCondition}
          columns={[{ accessor: 'key', width: 400 }, { accessor: 'value' }]}
          noHeader
        />
        <Text className="font-semibold my-4">
          Jv at least one partner condition
        </Text>
        <DataTable
          withColumnBorders
          withTableBorder
          records={jvAtleastOnePartnerCondition}
          columns={[{ accessor: 'key', width: 400 }, { accessor: 'value' }]}
          noHeader
        />
      </Box>{' '}
    </>
  );
};
