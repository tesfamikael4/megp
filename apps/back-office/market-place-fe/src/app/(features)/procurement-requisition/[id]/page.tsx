'use client';
import { Flex, LoadingOverlay, Paper, Stack, Text } from '@mantine/core';
import React from 'react';
import { useParams } from 'next/navigation';
import { useReadQuery } from '../_api/procurement-requisition.api';
import { logger } from '@megp/core-fe';
import { IconCornerUpLeft } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { Items } from '../_components/items';

export default function ProcurmentRequisition() {
  const { id } = useParams();
  const { data: procurmentRequisition, isLoading: isGettingProcurment } =
    useReadQuery(id.toString());
  const router = useRouter();

  logger.log(procurmentRequisition);
  return (
    <Stack>
      <Paper className="p-4" withBorder radius="sm">
        <LoadingOverlay visible={isGettingProcurment} />
        <Stack>
          <Flex className="gap-2 items-center">
            <IconCornerUpLeft size={22} onClick={() => router.back()} />
            <Text fw={700} fz="md">
              {procurmentRequisition?.name}
            </Text>
          </Flex>
          <Flex direction={'column'} className="gap-2 ml-8">
            <Text>
              Reference No: {procurmentRequisition?.procurementReference}
            </Text>
            <Text>Description: {procurmentRequisition?.description}</Text>
          </Flex>
        </Stack>
      </Paper>
      <Items activityId={id.toString()} />
    </Stack>
  );
}
