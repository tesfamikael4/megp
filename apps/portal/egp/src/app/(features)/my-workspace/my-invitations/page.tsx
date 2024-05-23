'use client';
import {
  ActionIcon,
  Box,
  Button,
  Flex,
  Modal,
  Stack,
  Text,
} from '@mantine/core';
import { IconBookmark, IconChevronRight } from '@tabler/icons-react';
import { ExpandableTable } from '@megp/core-fe';
import { useRouter } from 'next/navigation';
import {
  useLazyInvitationsQuery,
  useRegisterMutation,
} from '../_api/invitation-registration.api';
import { useDisclosure } from '@mantine/hooks';
import { DetailTable } from '../../_components/detail-table/detail-table';
import { useState } from 'react';
import Items from '../../invitations-workspace/prepare-bid/_components/price-schedule/item.component';
import Invitation from '../../invitations-workspace/prepare-bid/_components/price-schedule/matched-products-list.component';
import { notifications } from '@mantine/notifications';
import { useLazyGetMatchedProductsQuery } from '../../invitations-workspace/_api/items.api';
import InvitationDetail from '../../invitations-workspace/prepare-bid/_components/price-schedule/invitation-detail.component';
export default function MyInvitationsPage() {
  const [trigger, { data, isFetching }] = useLazyInvitationsQuery();
  const [opened, { open, close }] = useDisclosure(false);
  const [selected, setSelected] = useState<any>();
  const router = useRouter();
  const [register, { isLoading: isRegistering }] = useRegisterMutation();
  const [
    getInvitations,
    { data: invitationsList, isLoading: isGettingInvitations },
  ] = useLazyGetMatchedProductsQuery();
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
              setSelected(record);
              open();
              getInvitations({ id: record.id, collectionQuery: {} });
              // router.push(`/invitations-workspace/${record.id}`);
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

  const RFQConfig = [
    {
      key: 'RFQ Name',
      value: selected?.name,
    },
    {
      key: 'Procurement Category',
      value: selected?.procurementCategory,
    },
    {
      key: 'Procurement Category',
      value: selected?.procurementCategory,
    },
    {
      key: 'Procurement Reference Number',
      value: selected?.procurementReferenceNumber,
    },
  ];

  const handleRegister = async () => {
    try {
      await register(selected?.id);
      notifications.show({
        title: 'Success',
        message: 'Invitation registered successfully',
        color: 'green',
      });
      router.push(`/invitations-workspace/${selected.id}`);
    } catch (err) {
      notifications.show({
        title: 'Error',
        message: 'Invitation registration failed',
      });
    }
  };
  return (
    <>
      <Modal fullScreen opened={opened} onClose={close}>
        <Stack>
          <Flex className="ml-auto gap-4">
            <Button onClick={handleRegister} loading={isRegistering}>
              Register
            </Button>
            <Button leftSection={<IconBookmark />}>Bookmark</Button>
          </Flex>
          <Text>RFQ Detail</Text>
          <DetailTable data={RFQConfig} />
          <Items id={selected?.id} />
          <Text>Matched Products</Text>
          {invitationsList?.items?.map((product, index) => (
            <InvitationDetail
              key={index}
              product={product}
              showAction={false}
            />
          ))}
        </Stack>
      </Modal>
      <Box className="p-6 bg-[#e7f4f7]">
        <Box className=" w-full p-6 min-h-screen bg-white">
          <Flex direction={'column'} className="w-full py-2 mb-4 border-b-2">
            <Text fw={700} fz="xl" c={'#1D8E3F'}>
              My Invitations
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
