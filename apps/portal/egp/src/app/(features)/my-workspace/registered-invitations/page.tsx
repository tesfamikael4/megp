'use client';
import { ActionIcon, Box, Flex, Text } from '@mantine/core';
import { IconChevronRight } from '@tabler/icons-react';
import { ExpandableTable } from '@megp/core-fe';
import { useRouter } from 'next/navigation';
import { useLazyInvitationsQuery } from '../_api/invitation-registration.api';
import { notifications } from '@mantine/notifications';
export default function MyInvitationsPage() {
  const [trigger, { data, isFetching }] = useLazyInvitationsQuery();
  const router = useRouter();

  const config = {
    columns: [
      {
        accessor: 'organizationName',
        title: 'Procuring Entity',
      },
      {
        accessor: 'procurementReferenceNumber',
        title: 'Procurement Reference Number',
      },
      {
        accessor: 'name',
      },
      {
        accessor: '',
        render: (record) => (
          <ActionIcon
            variant="subtle"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/invitations-workspace/${record.id}`);
            }}
          >
            <IconChevronRight size={14} />
          </ActionIcon>
        ),
        width: 100,
      },
    ],
    isExpandable: false,
    isSearchable: true,
    primaryColumn: 'title',
    isLoading: isFetching,
  };
  const onRequestChange = (request: any) => {
    trigger(request);
  };

  return (
    <>
      <Box className="p-6 bg-[#e7f4f7]">
        <Box className=" w-full p-6 min-h-screen bg-white">
          <Flex direction={'column'} className="w-full py-2 mb-4 border-b-2">
            <Text fw={700} fz="xl" c={'#1D8E3F'}>
              Registered Invitations
            </Text>
          </Flex>
          <ExpandableTable
            config={config}
            data={data?.items ?? []}
            total={data?.total ?? 0}
            onRequestChange={onRequestChange}
          />
        </Box>
      </Box>
    </>
  );
}
