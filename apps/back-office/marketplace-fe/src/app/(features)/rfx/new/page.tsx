'use client';
import { Section } from '@megp/core-fe';
import { useLazyListQuery } from '../_api/pr/procurement-requisition.api';
import { Flex } from '@mantine/core';
import { ExpandableTable } from '@megp/core-fe';
import { DetailRequisition } from '../_components/detail-requisition-list';
import { useRouter } from 'next/navigation';
import { IconArrowLeft } from '@tabler/icons-react';
import { useLazyListPRsQuery } from '@/store/api/rfx/pr.api';

export default function RFXPage() {
  const router = useRouter();
  const [trigger, { data, isLoading }] = useLazyListPRsQuery();

  const config = {
    columns: [
      {
        accessor: 'procurementReference',
        title: 'Reference Number',
        width: 150,
        sortable: true,
      },
      { accessor: 'name', title: 'Title', width: 200, sortable: true },
      {
        accessor: 'calculatedAmount',
        title: 'Total Amount',
        sortable: true,
        render: (pr) => (
          <>
            {parseInt(pr.calculatedAmount).toLocaleString('en-US', {
              style: 'currency',
              currency: 'MKW',
            })}
          </>
        ),
        width: 150,
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
    trigger({
      ...request,
      orderBy: [
        {
          column: 'createdAt',
          direction: 'DESC',
        },
      ],
    });
  };
  return (
    <>
      <Section
        title={
          <Flex className="gap-2 items-center">
            <IconArrowLeft
              size={18}
              onClick={() => router.back()}
              className="cursor-pointer"
            />
            {'Select Procurement Requisition'}
          </Flex>
        }
        collapsible={false}
      >
        <div className="w-5/6 xl:w-3/4 flex flex-col items-start">
          <p className="text-sm">
            To create a RFQ you should select a procurement requisition first
          </p>
        </div>
        <ExpandableTable
          config={config}
          data={data?.items ?? []}
          total={data?.total ?? 0}
          onRequestChange={onRequestChange}
        />
      </Section>
    </>
  );
}
