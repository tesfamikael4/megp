import { Badge, Flex, LoadingOverlay, Stack, Text } from '@mantine/core';
import React from 'react';
import { useReadQuery } from '../../rfx/_api/rfx/rfx.api';
import { useParams, useRouter } from 'next/navigation';
import { IconChevronLeft } from '@tabler/icons-react';
import { Section } from '@megp/core-fe';

export default function RfxHeader() {
  const { rfxId } = useParams();
  const router = useRouter();
  const { data, isLoading: isGettingDetail } = useReadQuery(rfxId?.toString());

  return (
    <Stack>
      <Section
        collapsible={false}
        title={
          <Flex align="center" className="gap-2 pt-1 pb-1 items-center">
            <IconChevronLeft
              size={20}
              className="cursor-pointer"
              onClick={() => router.push('/award')}
            />
            <Text className="font-semibold">{data?.name ?? ''}</Text>
          </Flex>
        }
      >
        <LoadingOverlay visible={isGettingDetail} />
        <Flex className="gap-72 mb-2">
          <Flex className="px-6 flex-col gap-2">
            <Flex className="gap-2 items-center">
              <p>Ref no:</p>
              <Badge variant="outline">
                {data?.procurementReferenceNumber}
              </Badge>
            </Flex>
            <Flex className="gap-2 items-center">
              <p>Category:</p>
              <Badge variant="outline">
                {data?.procurementCategory ?? '-'}
              </Badge>
            </Flex>
          </Flex>
          <Flex className="px-6 flex-col gap-2">
            <Flex className="gap-2 items-center">
              <p>Budget:</p>
              <Badge variant="outline">
                {data?.budgetAmountCurrency}{' '}
                {data?.budgetAmount?.toLocaleString('en-US', {
                  style: 'currency',
                  currency: data?.budgetAmountCurrency,
                })}
              </Badge>
            </Flex>
            <Flex className="gap-2 items-center">
              <p>Status:</p>
              <Badge variant="outline">{data?.status}</Badge>
            </Flex>
          </Flex>
        </Flex>
      </Section>
    </Stack>
  );
}
