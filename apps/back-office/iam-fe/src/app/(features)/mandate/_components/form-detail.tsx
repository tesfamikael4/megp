import { LoadingOverlay, Stack, Table } from '@mantine/core';
import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useReadQuery } from '../_api/mandate.api';

export function FormDetail() {
  const { reset } = useForm({});

  const { id } = useParams();

  const {
    data: selected,
    isSuccess: selectedSuccess,
    isLoading,
  } = useReadQuery(id?.toString());

  useEffect(() => {
    if (selectedSuccess && selected !== undefined) {
      reset({
        name: selected?.name,
        description: selected?.description,
      });
    }
  }, [reset, selected, selectedSuccess]);

  return (
    <Stack pos="relative">
      <LoadingOverlay visible={isLoading} />
      <Table highlightOnHover withTableBorder withColumnBorders>
        <Table.Tbody>
          <Table.Tr>
            <Table.Td className="bg-slate-200 font-semibold w-1/3">
              Name
            </Table.Td>
            <Table.Td>{selected?.name}</Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Td className="bg-slate-200 font-semibold w-1/3">
              Description
            </Table.Td>
            <Table.Td>{selected?.description}</Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table>
    </Stack>
  );
}
