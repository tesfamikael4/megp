'use client';

import { ExpandableTable } from '@megp/core-fe';
import { Section } from '@megp/core-fe';
import { useRouter } from 'next/navigation';
import { ActionIcon } from '@mantine/core';
import { IconChevronRight } from '@tabler/icons-react';
import { DetailRequisition } from '@/app/(features)/procurement-requisition/_components/detail-requisition-list';
import { useLazyListQuery } from '@/app/(features)/procurement-requisition/_api/procurement-requisition.api';

export default function ProcurementRequisition() {
  const [trigger, { data, isLoading }] = useLazyListQuery();
  const router = useRouter();

  const config = {
    columns: [
      {
        accessor: 'procurementReference',
        title: '#Ref',
        width: 150,
        sortable: true,
      },
      { accessor: 'name', title: 'Title', width: 200, sortable: true },
      {
        accessor: 'description',
        title: 'Description',
        width: 250,
        sortable: true,
      },
      { accessor: 'status', title: 'Status', width: 100, sortable: true },
      {
        accessor: 'calculatedAmount',
        title: 'Total Amount',
        textAlign: 'right',
        sortable: true,
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
        width: 150,
      },
      {
        accessor: 'id',
        title: '',
        render: (pr) => (
          <ActionIcon
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/pr-approve/${pr.id}`);
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
    isLoading: isLoading,
    primaryColumn: 'name',
    expandedRowContent: (requisition) => {
      return <DetailRequisition requisition={requisition} />;
    },
  };

  const onRequestChange = (request: any) => {
    request.where.push([
      {
        column: 'status',
        operator: '=',
        value: 'SUBMITTED',
      },
    ]);
    trigger(request);
  };

  return (
    <Section title="Procurement Requisition" collapsible={false}>
      <ExpandableTable
        config={config}
        data={
          data?.items.map((item) => {
            return {
              ...item,
              status:
                item.status.charAt(0).toUpperCase() +
                item.status.slice(1).toLowerCase(),
            };
          }) ?? []
        }
        total={data?.total ?? 0}
        onRequestChange={onRequestChange}
      />
    </Section>
  );
}
