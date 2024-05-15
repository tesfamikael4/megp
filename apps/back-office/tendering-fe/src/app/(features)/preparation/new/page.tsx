'use client';
import React from 'react';
import { Section, logger, notify } from '@megp/core-fe';
import { useLazyListQuery } from '../_api/tender/procurement-requisition.api';
import { ActionIcon } from '@mantine/core';
import { IconChevronRight } from '@tabler/icons-react';
import { ExpandableTable } from '../../_components/expandable-table';
import { DetailRequisition } from '../../_components/detail-requisition-list';
import { useCreateMutation } from '../_api/tender/tender.api';
import { useRouter } from 'next/navigation';

export default function TenderingPage() {
  const router = useRouter();
  const [trigger, { data, isLoading }] = useLazyListQuery();

  const [create, { isLoading: isSaving }] = useCreateMutation();
  const onClickPRSelection = async (value: any) => {
    create({ prId: value.id })
      .unwrap()
      .then((result) => {
        router.push(`/preparation/${result.data.id}`);
      })
      .catch((err) => {
        notify('Error', err.data.message);
      });
  };

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
        sortable: true,
        render: (pr) => (
          <>{parseInt(pr.calculatedAmount).toLocaleString('en-US')}</>
        ),
        width: 150,
      },
      {
        accessor: 'id',
        title: '',
        render: (pr) => (
          <ActionIcon
            loading={isSaving}
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              onClickPRSelection(pr);
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
    primaryColumn: 'title',
    expandedRowContent: (requisition) => {
      return <DetailRequisition requisition={requisition} />;
    },
  };

  const onRequestChange = (request: any) => {
    trigger(request);
  };
  return (
    <>
      <Section title="Select Procurement Requisition" collapsible={false}>
        <div className="w-5/6 xl:w-3/4 flex flex-col items-start">
          <p className="text-sm">
            To create a tender you should select a procurement requisition first
          </p>
        </div>
        <ExpandableTable
          config={config}
          data={data ? data.items : []}
          total={data ? data.total : 0}
          onRequestChange={onRequestChange}
        />
      </Section>
    </>
  );
}
