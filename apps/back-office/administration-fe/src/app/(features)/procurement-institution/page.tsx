'use client';
import { Box, Button, Group, LoadingOverlay, Text } from '@mantine/core';
import { notify } from '@megp/core-fe';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import {
  useCreateMutation,
  useListQuery,
} from './_api/procurement-institution.api';

export default function ProcurementInstution() {
  const {
    data: procurementInstution,
    isLoading,
    isSuccess,
  } = useListQuery({} as any);
  const [create, { isLoading: isCreating }] = useCreateMutation();
  const router = useRouter();

  const handleInitiate = async () => {
    try {
      const res = await create({} as any).unwrap();
      router.push(`/procurement-institution/${res.id}`);
      notify('Success', 'Procurement Instutuion Initiated Successfully');
    } catch (err) {
      notify('Error', 'Something went wrong');
    }
  };

  useEffect(() => {
    if (
      isSuccess &&
      procurementInstution &&
      procurementInstution.items.length > 0
    ) {
      const id = procurementInstution.items[0].id;
      router.push(`/procurement-institution/${id}`);
    }
  }, [isSuccess, procurementInstution]);
  return (
    <Box pos="relative" className="h-[80vh] flex justify-center items-center">
      <LoadingOverlay visible={isLoading} />
      {procurementInstution?.items?.length == 0 && (
        <Box className="flex justify-center items-center flex-col">
          <Text className="text-xs">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ea, nulla!
          </Text>
          <Button
            onClick={handleInitiate}
            variant="outline"
            className="mt-2"
            loading={isCreating}
          >
            Initiate
          </Button>
        </Box>
      )}
    </Box>
  );
}
