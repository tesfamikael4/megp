import { LoadingOverlay, Stack, Table } from '@mantine/core';
import { useForm } from 'react-hook-form';
import { useReadQuery } from '../_api/application.api';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';

interface FormDetailProps {
  mode: 'detail';
}

export function FormDetail({ mode }: FormDetailProps) {
  const { reset } = useForm({});

  const { id } = useParams();

  const {
    data: selected,
    isSuccess: selectedSuccess,
    isLoading,
  } = useReadQuery(id?.toString());

  useEffect(() => {
    if (mode == 'detail' && selectedSuccess && selected !== undefined) {
      reset({
        name: selected?.name,
        description: selected?.description,
        key: selected?.key,
      });
    }
  }, [mode, reset, selected, selectedSuccess]);

  return (
    <Stack pos="relative">
      <LoadingOverlay visible={isLoading} />

      <Table highlightOnHover withTableBorder withColumnBorders>
        <Table.Tbody>
          <Table.Tr>
            <Table.Td className="bg-slate-200 font-semibold">Name</Table.Td>
            <Table.Td>{selected?.name}</Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Td className="bg-slate-200 font-semibold">
              Description
            </Table.Td>
            <Table.Td>{selected?.description}</Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table>
    </Stack>
  );
}
