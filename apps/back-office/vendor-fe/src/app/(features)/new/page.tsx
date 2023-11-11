'use client';
import React from 'react';
import { Box, Text, Flex, Skeleton, Avatar, Tooltip } from '@mantine/core';
import {
  IconTicket,
  IconFileInvoice,
  IconTag,
  IconClockHour2,
} from '@tabler/icons-react';
import { Section } from '@megp/core-fe';
import RequestsSidebar from '../_components/requests-sidebar';
import { useGetAllVendorRequestsQuery } from '@/store/api/vendor_request_handler/new-registration-api';
import { useRouter } from 'next/navigation';

export default function NewRegistration() {
  const router = useRouter();
  const response = useGetAllVendorRequestsQuery({
    serviceKey: 'new',
  });

  if (!response || !response.data) {
    return (
      <>
        <Box className="p-5 w-10/12">
          <Skeleton height={50} circle mb="xl" />
          <Skeleton height={8} radius="xl" />
          <Skeleton height={8} mt={10} radius="xl" />
          <Skeleton height={8} mt={10} width="70%" radius="xl" />

          <Skeleton height={50} mt={10} circle mb="xl" />
          <Skeleton height={8} radius="xl" />
          <Skeleton height={8} mt={10} radius="xl" />
          <Skeleton height={8} mt={10} width="70%" radius="xl" />

          <Skeleton height={50} mt={10} circle mb="xl" />
          <Skeleton height={8} radius="xl" />
          <Skeleton height={8} mt={10} radius="xl" />
          <Skeleton height={8} mt={10} width="70%" radius="xl" />

          <Skeleton height={50} mt={10} circle mb="xl" />
          <Skeleton height={8} radius="xl" />
          <Skeleton height={8} mt={10} radius="xl" />
          <Skeleton height={8} mt={10} width="70%" radius="xl" />
        </Box>
      </>
    );
  }

  return (
    <Flex direction="row" gap="sm">
      <Section collapsible={false} title="New Request Handling">
        {response.data?.items.map((item, index) => (
          <Box
            key={index}
            onClick={() => router.push(`/new/detail/${item.id}`)}
          >
            <Flex
              direction="row"
              justify="space-between"
              className="items-center border border-gray-200 p-3 cursor-pointer hover:bg-gray-100"
            >
              <Box className="pr-3">
                <Avatar color="cyan" radius="xl" size="lg">
                  {item.vendor.name?.charAt(0)}
                </Avatar>
              </Box>
              <Flex direction="column" className="gap-[0.125rem] w-2/3">
                <Text className="text-primary-800 font-bold">
                  Vendor: {item.vendor.name}
                </Text>
                <Text>Requester: {item.vendor.name}</Text>
                <Text>Vendor Type: {item.vendor.origin}</Text>
                <Text>Task: {item.task.name}</Text>
              </Flex>
              <Flex
                direction="column"
                className="gap-[0.125rem] border-l border-gray-200 w-1/3 pl-2"
              >
                <Flex direction="row" className="items-center gap-1">
                  <Tooltip label="Tracking number">
                    <IconTicket size={18} />
                  </Tooltip>
                  <Text>{item.applicationNumber}</Text>
                </Flex>
                <Flex direction="row" className="items-center gap-1">
                  <Tooltip label="Business area">
                    <IconFileInvoice size={18} />
                  </Tooltip>
                  <Text>{item.service.name}</Text>
                </Flex>
                <Flex direction="row" className="items-center gap-1">
                  <Tooltip label="Status">
                    <IconTag size={18} />
                  </Tooltip>
                  <Text>{item.vendor.status}</Text>
                </Flex>
                <Flex direction="row" className="items-center  gap-1">
                  <Tooltip label="Executed time">
                    <IconClockHour2 size={18} />
                  </Tooltip>
                  <Text>{item.submittedAt.split('T')[0]}</Text>
                </Flex>
              </Flex>
            </Flex>
          </Box>
        ))}
      </Section>
      <Box className="w-2/6">
        <RequestsSidebar />
      </Box>
    </Flex>
  );
}
