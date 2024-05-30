'use client';
import { useEffect, useState } from 'react';
import { Section, notify } from '@megp/core-fe';
import {
  useLazyGetApprovedPRQuery,
  useLazyGetReAdvertTenderQuery,
} from '../_api/tender/procurement-requisition.api';
import { ActionIcon, Box, Select, Text } from '@mantine/core';
import { IconChevronRight } from '@tabler/icons-react';
import { ExpandableTable } from '../../_components/expandable-table';
import { DetailRequisition } from '../../_components/detail-requisition-list';
import { useCreateMutation } from '../_api/tender/tender.api';
import { useRouter } from 'next/navigation';
import TenderDetail from '../_components/tender/tender-detail';

export default function TenderingPage() {
  const router = useRouter();
  const [trigger, { data, isLoading }] = useLazyGetApprovedPRQuery();
  const [triggerReAdvert, { data: readverts, isLoading: reAdvertLoading }] =
    useLazyGetReAdvertTenderQuery();
  const [selectFrom, setSelectFrom] = useState('Procurement Requisition');
  const [create, { isLoading: isSaving }] = useCreateMutation();
  const onClickPRSelection = async (value: any) => {
    create({ prId: value.id })
      .unwrap()
      .then((result) => {
        router.push(`/preparation/${result.id}?tab=configuration`);
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

  const tenderConfig = {
    columns: [
      { accessor: 'name', title: 'Name', width: 200 },
      {
        accessor: 'procurementReferenceNumber',
        title: 'Procurement Reference Number',
        width: 200,
      },
      { accessor: 'budgetAmount', title: 'Budget Amount' },
      { accessor: 'budgetCode', title: 'Budget Code' },
      { accessor: 'status', title: 'Status' },
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
    primaryColumn: 'title',
    isFetching: reAdvertLoading,
    expandedRowContent: (tender) => {
      return <TenderDetail tender={tender} />;
    },
  };
  useEffect(() => {
    selectFrom === 'Procurement Requisition'
      ? trigger({ skip: 0, take: 10 })
      : triggerReAdvert({ skip: 0, take: 10 });
  }, [selectFrom, trigger, triggerReAdvert]);

  const onRequestChange = (request: any) => {
    selectFrom === 'Procurement Requisition'
      ? trigger(request)
      : triggerReAdvert(request);
  };
  return (
    <>
      <Section
        title={
          <Box className="flex space-x-3">
            <Text className="my-auto">Select From</Text>
            <Select
              value={selectFrom}
              className="w-64"
              onChange={(data) => {
                setSelectFrom(data ?? '');
              }}
              data={['Procurement Requisition', 'Re-advertized Tender']}
            />
          </Box>
        }
        collapsible={false}
      >
        <div className="w-5/6 xl:w-3/4 flex flex-col items-start">
          <p className="text-sm">
            {selectFrom === 'Procurement Requisition'
              ? 'To create a tender you should select a procurement requisition first'
              : 'to create a tender form readvert tender please select one of the canceled tenders'}
          </p>
        </div>
        <ExpandableTable
          config={
            selectFrom === 'Procurement Requisition' ? config : tenderConfig
          }
          data={
            selectFrom === 'Procurement Requisition'
              ? data
                ? data.items
                : []
              : readverts
                ? readverts.items
                : []
          }
          total={
            selectFrom === 'Procurement Requisition'
              ? data
                ? data.total
                : []
              : readverts
                ? readverts.total
                : []
          }
          onRequestChange={onRequestChange}
        />
      </Section>
    </>
  );
}
