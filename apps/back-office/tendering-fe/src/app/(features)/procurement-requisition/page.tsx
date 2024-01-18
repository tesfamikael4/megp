'use client';

import { ExpandableTable } from '@/app/(features)/_components/expandable-table';
import { Section } from '@megp/core-fe';
import { useRouter } from 'next/navigation';
import { ActionIcon, Button } from '@mantine/core';
import { IconChevronRight, IconPlus } from '@tabler/icons-react';
import { DetailRequisition } from '@/app/(features)/_components/detail-requisition-list';
import { useLazyListQuery } from './_api/procurement-requisition.api';

export default function ProcurementRequisition() {
  const [trigger, { data, isFetching }] = useLazyListQuery();
  const router = useRouter();

  const config = {
    columns: [
      { accessor: 'requisitionReferenceNumber', title: '#Ref', width: 150 },
      { accessor: 'title', title: 'Title', width: 300 },
      { accessor: 'description', title: 'Description' },
      { accessor: 'status', title: 'Status' },
      {
        accessor: 'calculatedAmount',
        title: 'Total Amount',
        textAlign: 'right',
        render: (activity) => (
          <>
            {parseInt(activity.calculatedAmount).toLocaleString('en-US', {
              style: 'currency',
              currency: activity.currency,
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
              currencyDisplay: 'code',
            })}
          </>
        ),
        width: 200,
      },
      {
        accessor: 'id',
        title: '',
        render: (pr) => (
          <ActionIcon
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/procurement-requisition/${pr.id}`);
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
    expandedRowContent: (requisition) => {
      return <DetailRequisition requisition={requisition} />;
    },
  };

  const onRequestChange = (request: any) => {
    trigger(request);
  };

  return (
    <Section
      title="Procurement Requisition"
      collapsible={false}
      action={
        <Button onClick={() => router.push(`procurement-requisition/new`)}>
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
