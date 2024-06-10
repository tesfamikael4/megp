'use client';
import { Badge, Flex, LoadingOverlay, Text } from '@mantine/core';
import { useParams, useRouter } from 'next/navigation';
import { IconChevronLeft } from '@tabler/icons-react';
import { useReadQuery } from '../../rfx/_api/rfx/rfx.api';
import { Section } from '@megp/core-fe';

export default function RFXHeader() {
  const router = useRouter();
  const { id } = useParams();
  const { data, isLoading: isGettingDetail } = useReadQuery(id?.toString());

  return (
    <>
      <Section
        title={
          <Flex align="center" className="gap-2 pt-1 pb-1 items-center">
            <IconChevronLeft
              size={20}
              className="cursor-pointer"
              onClick={() => router.push('/assignment')}
            />
            <Text className="font-semibold">{data?.name ?? ''}</Text>
          </Flex>
        }
        collapsible={false}
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
              <p>Total bidders:</p>
              <Badge variant="outline">{data?.bidders ?? '-'}</Badge>
            </Flex>
          </Flex>
          <Flex className="px-6 flex-col gap-2">
            <Flex className="gap-2 items-center">
              <p>Is Open:</p>
              <Badge variant="outline">{data?.isOpen ? 'true' : 'false'}</Badge>
            </Flex>
            <Flex className="gap-2 items-center">
              <p>Status:</p>
              <Badge variant="outline">{data?.status}</Badge>
            </Flex>
          </Flex>
        </Flex>
      </Section>
    </>
  );
}
