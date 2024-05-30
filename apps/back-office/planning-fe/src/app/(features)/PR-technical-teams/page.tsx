'use client';

import { ExpandableTable, Section } from '@megp/core-fe';
import { useRouter } from 'next/navigation';
import { ActionIcon, Tooltip } from '@mantine/core';
import { IconChevronRight } from '@tabler/icons-react';
import { DetailRequisition } from '@/app/(features)/procurement-requisition/_components/detail-requisition-list';
import { useLazyListQuery } from '../procurement-requisition/_api/procurement-requisition.api';
import { CollectionQuery } from '@megp/entity';

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
        accessor: 'totalEstimatedAmount',
        title: 'Total Amount',
        textAlign: 'right',
        sortable: true,
        render: (activity) => (
          <>
            {parseInt(activity.totalEstimatedAmount).toLocaleString('en-US', {
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
        accessor: '',
        title: '',
        render: (record) =>
          record.reasons.length == 0 ? (
            <Tooltip label={'Aligns perfectly with the rule'}>
              <p className="text-green-500 text-3xl">•</p>
            </Tooltip>
          ) : (
            <Tooltip label={'Violated the rule'}>
              <p className="text-red-500 text-3xl">•</p>
            </Tooltip>
          ),
        width: 50,
      },
      {
        accessor: 'id',
        title: '',
        render: (pr) => (
          <ActionIcon
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/PR-technical-teams/${pr.id}`);
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

  const onRequestChange = (request: CollectionQuery) => {
    request?.where?.push([
      {
        column: 'status',
        value: 'APPROVED',
        operator: '=',
      },
    ]);
    trigger({ ...request, includes: ['reasons'] });
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
