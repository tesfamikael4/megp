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
      <div className="mt-4 mb-4 border border-slate-300">
        <Table className="w-100">
          <tbody>
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
          </tbody>
        </Table>
      </div>
    </Stack>
  );
}
