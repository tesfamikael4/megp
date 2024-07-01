'use client';

import { ActionIcon, Box, Button } from '@mantine/core';
import { ExpandableTable, Section } from '@megp/core-fe';
import { IconChevronRight, IconPlus } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useLazyListQuery } from './_api/po.api';

export default function Preparation() {
  const [trigger, { data, isFetching }] = useLazyListQuery();

  const router = useRouter();

  const config = {
    columns: [
      { accessor: 'referenceNumber', title: 'Ref.No', width: 200 },
      { accessor: 'procurementReference', title: 'Pr Ref.No', width: 200 },
      { accessor: 'organizationName', title: 'Name' },
      { accessor: 'description', title: 'Description' },
      { accessor: 'status', title: 'Status' },
      {
        accessor: 'id',
        title: '',
        render: (order) => (
          <ActionIcon
            variant="outline"
            onClick={() => router.push(`/purchase-order/${order?.id}`)}
          >
            <IconChevronRight />
          </ActionIcon>
        ),
        width: 50,
      },
    ],
    isExpandable: false,
    isSearchable: true,
    primaryColumn: 'name',
    isFetching: isFetching,
  };

  const onRequestChange = (request: any) => {
    trigger(request);
  };

  return (
    <Section
      title="Purchase Order"
      collapsible={false}
      action={
        <Button onClick={() => router.push('purchase-order/choose-award')}>
          <IconPlus size={14} /> New
        </Button>
      }
    >
      <Box className="">
        <ExpandableTable
          config={config}
          data={data?.items ?? []}
          total={0}
          onRequestChange={onRequestChange}
        />
      </Box>
    </Section>
  );
}
