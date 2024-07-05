'use client';
import { DetailTable } from '@/app/(features)/_components/detail-table/detail-table';
import { Badge, Button, Flex, Paper, Stack, Text } from '@mantine/core';
import { IconChevronDown, IconChevronUp } from '@tabler/icons-react';
import React, { useState } from 'react';
import { useAcceptOrRejectAwardMutation } from '../../../_api/items.api';
import { notifications } from '@mantine/notifications';
import { Timer } from '../../../_components/timer.component';

export default function AwardedItemDetail({ item }: { item: any }) {
  const [acceptAward, { isLoading: isAccepting }] =
    useAcceptOrRejectAwardMutation();
  const [rejectAward, { isLoading: isRejecting }] =
    useAcceptOrRejectAwardMutation();
  const [showDetail, setShowDetail] = useState(false);
  const specificationDetails = Object.entries(
    item?.technicalRequirement?.technicalSpecification || {},
  )
    .filter(([key]) => key !== 'url')
    .map(([key, value]) => ({
      key: `${key.charAt(0).toUpperCase() + key.slice(1)}`,
      value: value ?? '',
    }));

  const itemDetail = [
    {
      key: 'Item description',
      value: item?.name,
    },
    {
      key: 'Quantity',
      value: item?.name,
    },
    {
      key: 'Unit Of Measure',
      value: item?.unitOfMeasure,
    },
  ];

  const priceDetail = [
    {
      key: 'Price',
      value: `MKW ${item?.awardItem?.openedOffer?.price?.toLocaleString(
        'en-US',
        {
          style: 'currency',
          currency: 'MKW',
        },
      )}`,
    },
    {
      key: 'Tax %',
      value: `${item?.awardItem?.openedOffer?.tax} %`,
    },
    {
      key: 'Tax Amount',
      value: `MKW ${
        (parseFloat(item?.awardItem?.openedOffer?.price ?? '0') *
          parseFloat(item?.awardItem?.openedOffer?.tax)) /
        100
      }`,
    },
    {
      key: 'Total Price',
      value: `MKW ${item?.awardItem?.calculatedPrice}`,
    },
  ];
  const handleSubmit = async (mode) => {
    try {
      mode == 'accept' &&
        (await acceptAward({
          id: item?.awardItem?.id,
          status: 'ACCEPTED',
        }));
      mode == 'reject' &&
        (await rejectAward({
          id: item?.awardItem?.id,
          status: 'CANCELLED',
        }));
    } catch (err: any) {
      notifications.show({
        title: 'Error',
        message: err?.data?.message,
        color: 'red',
      });
    }
  };
  return (
    <Paper className="bg-neutral-100 rounded-sm p-4" withBorder>
      <Stack>
        {item?.awardItem?.status == 'PENDING' && (
          <Flex className="ml-auto flex-col">
            <Flex className="items-center gap-2">
              <Text>Deadline to accept or reject Award:</Text>
              <Timer
                targetDate={
                  item?.awardItem?.openedOffer?.createdAt ??
                  new Date().toISOString()
                }
              />
            </Flex>
            <Flex className="gap-2">
              <Button
                className="bg-green-600"
                onClick={async () => handleSubmit('accept')}
                loading={isAccepting}
              >
                Accept
              </Button>
              <Button
                className="bg-red-600"
                onClick={async () => handleSubmit('reject')}
                loading={isRejecting}
              >
                Reject
              </Button>
            </Flex>
          </Flex>
        )}
        {item?.awardItem?.status == 'ACCEPTED' && (
          <Button disabled className="bg-green-600">
            Accepted Award
          </Button>
        )}
        {item?.awardItem?.status == 'CANCELLED' && (
          <Button disabled className="bg-red-600">
            Rejected Award
          </Button>
        )}
        <DetailTable data={itemDetail} />
        <Paper className="w-2/5 mx-auto">
          <DetailTable data={priceDetail} />
        </Paper>
        <Badge
          className="mx-auto cursor-pointer"
          onClick={() => setShowDetail(!showDetail)}
          leftSection={showDetail ? <IconChevronUp /> : <IconChevronDown />}
        >
          {showDetail ? 'Show Less' : 'See item specification'}
        </Badge>
        {showDetail && (
          <Stack>
            <Text>Technical Specification</Text>
            <DetailTable data={specificationDetails as any} />
          </Stack>
        )}
      </Stack>
    </Paper>
  );
}
