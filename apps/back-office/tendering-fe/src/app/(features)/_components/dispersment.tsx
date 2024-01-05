import { Table } from '@mantine/core';
import { useParams } from 'next/navigation';

const elements = [
  {
    id: '1',
    budgetYear: 2023,
    first: '$100.00',
    second: '$100.00',
    third: '$100.00',
    fourth: '$100.00',
  },
];

function Despersment() {
  // const { budgetYear } = useParams();
  const rows = elements.map((element) => (
    <Table.Tr key={element.id}>
      <Table.Td>{2024}</Table.Td>
      <Table.Td>{element.first}</Table.Td>
      <Table.Td>{element.second}</Table.Td>
      <Table.Td>{element.third}</Table.Td>
      <Table.Td>{element.fourth}</Table.Td>
    </Table.Tr>
  ));

  return (
    <Table withColumnBorders mt={'lg'} horizontalSpacing={'lg'} striped>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Budget year</Table.Th>
          <Table.Th>1st quarter</Table.Th>
          <Table.Th>2nd quarter</Table.Th>
          <Table.Th>3rd quarter</Table.Th>
          <Table.Th>4th quarter</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>{rows}</Table.Tbody>
    </Table>
  );
}
export default Despersment;
