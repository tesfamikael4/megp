import { Item } from '@/models/tender/lot/item';
import { Box, Text, Table } from '@mantine/core';

export const DetailItem = ({ cell }: { cell: Item }) => {
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
      key: 'Item Code',
      value: cell.itemCode,
    },
    {
      key: 'Item Type',
      value: cell.itemType,
    },
    {
      key: 'Quantity',
      value: cell.quantity,
    },
    {
      key: 'Unit of measure',
      value: cell.unitOfMeasure,
    },
    {
      key: 'Estimated Price',
      value: `${cell.estimatedPrice} ${cell.estimatedPriceCurrency}`,
    },
    {
      key: 'Market Price',
      value: `${cell.marketPrice} ${cell.marketPriceCurrency}`,
    },
    {
      key: 'has Bill of quantity',
      value: `${cell.marketPrice}`,
    },
  ];
  return (
    <>
      <Box className="container mx-auto bg-white p-2" pos="relative">
        <Text className="font-semibold my-4">Definition</Text>
        <Table highlightOnHover withTableBorder withColumnBorders>
          <Table.Tbody>
            {data.map((item) => (
              <Table.Tr key={item.key}>
                <Table.Td className="bg-slate-100 font-semibold w-2/6">
                  {item.key}
                </Table.Td>
                <Table.Td>{item.value}</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Box>{' '}
    </>
  );
};
