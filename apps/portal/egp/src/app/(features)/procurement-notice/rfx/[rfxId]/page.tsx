'use client';
import { DetailTable } from '@/app/(features)/_components/detail-table/detail-table';
import InvitationDetail from '@/app/(features)/invitations-workspace/prepare-bid/_components/price-schedule/invitation-detail.component';
import Items from '@/app/(features)/invitations-workspace/prepare-bid/_components/price-schedule/item.component';
import { Button, Flex, Stack, Text } from '@mantine/core';
import { IconBookmark } from '@tabler/icons-react';
import React, { useEffect } from 'react';
import { useGetRfxQuery, useLazyGetRfxItemsQuery } from '../../_api/rfx.api';
import { useParams, useRouter } from 'next/navigation';
import { useRegisterMutation } from '@/app/(features)/my-workspace/_api/invitation-registration.api';
import { notifications } from '@mantine/notifications';

export default function RFXDetail() {
  const { rfxId } = useParams();
  const router = useRouter();
  const [register, { isLoading: isRegistering }] = useRegisterMutation();
  const { data: selected } = useGetRfxQuery({ id: rfxId?.toString() });

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
      key: 'Procurement Reference Number',
      value: selected?.procurementReferenceNumber,
    },
  ];

  const handleRegister = async () => {
    try {
      await register({ rfxId: rfxId.toString() }).unwrap();
      notifications.show({
        title: 'Success',
        message: 'Invitation registered successfully.',
        color: 'green',
      });
      router.push(`/invitations-workspace/${rfxId.toString()}`);
    } catch (err) {
      notifications.show({
        title: 'Error',
        message: err?.data?.message,
        color: 'red',
      });
    }
  };

  return (
    <Stack className="p-6">
      <Stack className="p-4">
        <Flex className="ml-auto gap-4">
          <Button onClick={handleRegister} loading={isRegistering}>
            Register
          </Button>
          <Button leftSection={<IconBookmark />}>Bookmark</Button>
        </Flex>
        <Text>RFQ Detail</Text>
        <DetailTable data={RFQConfig} />
        <Items id={rfxId.toString()} mode="open" />
      </Stack>
    </Stack>
  );
}
