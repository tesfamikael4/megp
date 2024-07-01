'use client';

import { Box } from '@mantine/core';
import { Section } from '@megp/core-fe';
// import { IconChevronRight } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
// import { useEffect } from 'react';
import { ExpandableTable } from '@megp/core-fe';
// import RFXDetail from '../rfx/_components/configuration/rfx-detail';
// import RFXDetail from '@/app/(features)/rfx/_components/configuration/rfx-detail';
import {
  useLazyListRfxOnAwardQuery,
  // useLazyListRfxOnReviewQuery,
} from '@/store/api/rfx/rfx.api';
import { DetailRequisition } from '../_components/list-of-items/detail-requisition-list';
// import { access } from 'fs';
// import { useLazyListQuery } from '@/app/(features)/rfx/_api/rfx/rfx.api';
// import RFXHeader from '../assignment/_components/rfx-header';

export default function Award() {
  const [trigger, { data, isFetching }] = useLazyListRfxOnAwardQuery();
  //   const [trigger, { data, isFetching }] = useLazyListQuery();
  // const router = useRouter();

  const config = {
    columns: [
      { accessor: 'name', title: 'Name', width: 200 },
      {
        accessor: 'procurementReferenceNumber',
        title: 'Reference Number',
        width: 200,
      },
      { accessor: 'budgetAmount', title: 'Budget Amount' },
      { accessor: 'budgetCode', title: 'Budget Code' },
      // {
      //   accessor: 'id',
      //   title: '',
      //   render: (award) => (
      //     <ActionIcon
      //       variant="outline"
      //       onClick={() => router.push(`/purchase-order/${award?.id}`)}
      //     >
      //       <IconChevronRight />
      //     </ActionIcon>
      //   ),
      //   width: 50,
      // },
    ],
    isExpandable: true,
    isSearchable: true,
    primaryColumn: 'title',
    isLoading: isFetching,
    expandedRowContent: (award) => {
      return <DetailRequisition award={award} />;
    },
  };

  const onRequestChange = (request: any) => {
    trigger(request);
  };

  return (
    <Section title="Awarded RFQs" collapsible={false}>
      <Box className="">
        <div className="w-5/6 xl:w-3/4 flex flex-col items-start">
          <p className="text-sm">
            To create a Purchase Order you should select a Awarded RFQ
          </p>
        </div>
        <ExpandableTable
          config={config}
          data={data?.items ?? []}
          total={data?.total ?? 0}
          onRequestChange={onRequestChange}
        />
      </Box>
    </Section>
  );
}
