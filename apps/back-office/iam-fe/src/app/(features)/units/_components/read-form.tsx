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
          <Table className="w-100">
            <tbody>
              <tr className="border-b-2 border-slate-300">
                <td className="w-1/4 bg-gray-100 p-2">
                  <th>Code</th>
                </td>
                <td className="p-2">{selected?.code}</td>
              </tr>
              <tr className="border-b-2 border-slate-300">
                <td className="w-1/4 bg-gray-100 p-2">
                  <th>Name</th>
                </td>
                <td className="p-2">{selected?.name}</td>
              </tr>

              <tr className="">
                <td className="bg-gray-100 p-2 ">
                  <th>Description</th>
                </td>
                <td className="p-2">{selected?.description}</td>
              </tr>
              <tr className="">
                <td className="bg-gray-100 p-2 ">
                  <th>Unit Type</th>
                </td>
                <td className="p-2">{unitType?.name}</td>
              </tr>
            </tbody>
          </Table>
        </div>
      </Box>
    </Stack>
  );
}
