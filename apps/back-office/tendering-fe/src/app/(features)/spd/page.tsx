'use client';
import { ExpandableTable } from '@/app/(features)/_components/expandable-table';
import { Section } from '@megp/core-fe';
import { useRouter } from 'next/navigation';
import { ActionIcon, Button } from '@mantine/core';
import { IconChevronRight, IconPlus } from '@tabler/icons-react';
import { useLazyListQuery } from './_api/spd.api';
import { DetailSpd } from '../_components/detail-spd';

export default function StandardProcurementDocument() {
  const [trigger, { data, isFetching }] = useLazyListQuery();
  const router = useRouter();

  const config = {
    columns: [
      { accessor: 'name', title: 'Name', width: 150 },
      { accessor: 'description', title: 'Description', width: 300 },
      { accessor: 'isActive', title: 'Active', width: 300 },
      {
        accessor: 'id',
        title: '',
        render: (pr) => (
          <ActionIcon
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/spd/${pr.id}?tab=definition`);
            }}
          >
            <IconChevronRight />
          </ActionIcon>
        ),
        width: 50,
      },
    ],
    isExpandable: true,
    isSearchable: true,
    isLoading: isFetching,
    primaryColumn: 'name',
    expandedRowContent: (spd) => {
      return <DetailSpd cell={spd} />;
    },
  };

  const onRequestChange = (request: any) => {
    trigger(request);
  };

  return (
    <Section
      title="Standard Procurement Document"
      collapsible={false}
      action={
        <Button onClick={() => router.push(`spd/new`)}>
          <IconPlus size={14} /> Add
        </Button>
      }
    >
      <ExpandableTable
        config={config}
        data={data?.items ?? []}
        total={data?.total ?? 0}
        onRequestChange={onRequestChange}
      />
    </Section>
  );
}
