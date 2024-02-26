import { LoadingOverlay, Stack, Table } from '@mantine/core';
import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useLazyListQuery } from '../_api/mandate.api';

export function FormDetail() {
  const { reset } = useForm({});

  const { id } = useParams();

  const [triggerMandates, { data: selected, isSuccess, isLoading }] =
    useLazyListQuery();

  useEffect(() => {
    if (id) {
      triggerMandates({
        where: [[{ column: 'id', operator: '=', value: id }]],
        includes: ['organizationMandates', 'organizationMandates.organization'],
      });
    }
  }, [id, triggerMandates]);

  useEffect(() => {
    if (isSuccess && selected !== undefined) {
      reset({
        name: selected?.items?.[0]?.name,
        description: selected?.items?.[0]?.description,
      });
    }
  }, [reset, selected, isSuccess]);

  return (
    <Stack pos="relative">
      <LoadingOverlay visible={isLoading} />
      <Table highlightOnHover withTableBorder withColumnBorders>
        <Table.Tbody>
          <Table.Tr>
            <Table.Td className="bg-slate-200 font-semibold w-1/3">
              Name
            </Table.Td>
            <Table.Td>{selected?.items?.[0]?.name}</Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Td className="bg-slate-200 font-semibold w-1/3">
              Description
            </Table.Td>
            <Table.Td>{selected?.items?.[0]?.description}</Table.Td>
          </Table.Tr>
          {selected?.items?.[0]?.isSingleAssignment && (
            <Table.Tr>
              <Table.Td className="bg-slate-200 font-semibold w-1/3">
                Assigned to
              </Table.Td>
              <Table.Td>
                {
                  selected?.items?.[0]?.organizationMandates?.[0]?.organization
                    ?.name
                }
              </Table.Td>
            </Table.Tr>
          )}
        </Table.Tbody>
      </Table>
    </Stack>
  );
}
