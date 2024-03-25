'use client';
import { Badge, Box, Text } from '@mantine/core';

import { ProcurementDisposal } from './_components/procurement-disposal';
import { Ipdc } from './_components/ipcd';
import { Adhoc } from './_components/adhoc';
import { useParams } from 'next/navigation';
import { useReadQuery } from '../_api/procurement-institution.api';

export default function ProcurementInstutionDetail() {
  const { id } = useParams();
  const { data } = useReadQuery(id as string);
  return (
    <>
      <Box className="bg-white rounded p-2 flex gap-2 items-center">
        <Text fw={500} size="xl">
          {data?.name ?? ''}
        </Text>

        <Badge color="yellow">{data?.status ?? ''}</Badge>
      </Box>
      <ProcurementDisposal />

      <Ipdc />

      <Adhoc />
    </>
  );
}
