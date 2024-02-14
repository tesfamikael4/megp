'use client';
import { Badge, Box, Button, Flex, Group, Text } from '@mantine/core';
import { modals } from '@mantine/modals';
import { notify } from '@megp/core-fe';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import { useLazyReadQuery } from '../spd/_api/spd.api';
import { useApproveSpdMutation } from '../spd/_api/approve-spd.api';

const SpdDetail = () => {
  const badgeColor = {
    Active: 'green',
    InActive: 'yellow',
  };

  //states
  const { id } = useParams();

  const [triggerSpd, { data: spd }] = useLazyReadQuery();
  const [approve, { isLoading }] = useApproveSpdMutation();

  const changeStatus = () => {
    modals.openConfirmModal({
      title: ` ${spd?.title}`,
      centered: true,
      children: (
        <Text size="sm">
          {`Are you sure you want to activate this standard procurement document  ${spd?.title}`}
        </Text>
      ),
      labels: { confirm: 'Yes', cancel: 'No' },
      onConfirm: handelSubmit,
    });
  };

  const handelSubmit = async () => {
    try {
      await approve({
        spdId: spd?.id,
      }).unwrap();
      notify('Success', 'Standard procurement document activated successfully');
    } catch (err) {
      if (err.status === 430) {
        notify('Error', err.data.message);
      } else {
        notify('Error', 'Something went wrong');
      }
    }
  };

  //use Effect

  useEffect(() => {
    triggerSpd(id?.toString());
  }, [id, triggerSpd]);

  return (
    <Box>
      <Box className="bg-white mb-2 rounded-r-md rounded-b-md">
        <Flex align="center" justify="space-between" className=" p-2 border-b">
          <Group>
            <Text className="font-semibold">{spd?.name}</Text>
            <Badge color={badgeColor[(spd as any)?.status] ?? 'yellow'}>
              {(spd as any)?.status}
            </Badge>
          </Group>
          <Group>
            <Button onClick={changeStatus} loading={isLoading}>
              {(spd as any)?.isActive ? 'Deactivate' : 'Activate'}
            </Button>
          </Group>
        </Flex>
      </Box>
    </Box>
  );
};

export default SpdDetail;
