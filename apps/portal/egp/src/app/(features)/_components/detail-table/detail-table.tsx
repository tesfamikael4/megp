import { Table } from '@mantine/core';

interface DetailTableItem {
  data: Record<string, string>[];
}

export const DetailTable = ({ data }: DetailTableItem) => {
  return (
    <>
      <Table highlightOnHover withTableBorder withColumnBorders>
        <Table.Tbody>
          {data.map((d) => (
            <>
              <Table.Tr>
                <Table.Td className="bg-slate-100 text-slate-600 w-1/3">
                  {d.key}
                </Table.Td>
                <Table.Td>{d.value}</Table.Td>
              </Table.Tr>
            </>
          ))}
        </Table.Tbody>
      </Table>
    </>
  );
};
