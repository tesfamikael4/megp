import { Box, LoadingOverlay, Stack, Table } from '@mantine/core';

import { z, ZodType } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useReadQuery } from '../_api/unit.api';
import { useReadQuery as useUnitTypeReadQuery } from '../../unit-type/_api/unit-type.api';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

import { Unit } from '@/models/unit';

const unitSchema: ZodType<Partial<Unit>> = z.object({
  name: z.string().min(1, { message: 'This field is required' }),
  typeId: z.string({
    required_error: 'This field is required',
    invalid_type_error: 'This field is required to be a string',
  }),
  description: z.string().optional(),
  parentId: z.string({
    required_error: 'This field is required',
    invalid_type_error: 'This field is required to be a string',
  }),
});

export function ReadDetail() {
  const { reset } = useForm({
    resolver: zodResolver(unitSchema),
  });

  const { id } = useParams();

  const [typeId, setTypeId] = useState<string>('');

  const {
    data: selected,
    isSuccess: selectedSuccess,
    isLoading,
  } = useReadQuery(id?.toString());

  const { data: unitType } = useUnitTypeReadQuery(typeId);

  useEffect(() => {
    if (selectedSuccess && selected !== undefined) {
      reset({
        name: selected?.name,
        description: selected?.description,
        code: selected?.code,
      });
    }
    setTypeId(selected?.typeId);
  }, [reset, selected, selectedSuccess]);

  return (
    <Stack>
      <Box pos="relative">
        <LoadingOverlay visible={isLoading} />
        <div className="mt-4 mb-4 border border-slate-300">
          <Table highlightOnHover withTableBorder withColumnBorders>
            <Table.Tbody>
              <Table.Tr>
                <Table.Td className="bg-slate-200 font-semibold w-1/3">
                  Name
                </Table.Td>
                <Table.Td>{selected?.name}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td className="bg-slate-200 font-semibold  w-1/3">
                  Description
                </Table.Td>
                <Table.Td>{selected?.description}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td className="bg-slate-200 font-semibold  w-1/3">
                  Unit Type
                </Table.Td>
                <Table.Td>{unitType?.name}</Table.Td>
              </Table.Tr>
            </Table.Tbody>
          </Table>
        </div>
      </Box>
    </Stack>
  );
}
