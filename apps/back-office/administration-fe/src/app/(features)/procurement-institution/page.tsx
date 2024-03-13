'use client';
import { Box, Button, LoadingOverlay, Text } from '@mantine/core';
import { useRouter } from 'next/navigation';

export default function ProcurementInstution() {
  const router = useRouter();
  return (
    <Box
      pos="relative"
      className="h-[80vh] flex justify-center items-center flex-col"
    >
      <LoadingOverlay visible={false} />
      <Text className="text-xs">
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ea, nulla!
      </Text>
      <Button
        onClick={() => router.push('/procurement-institution/initiate')}
        variant="outline"
        className="mt-2"
      >
        Initiate
      </Button>
    </Box>
  );
}
