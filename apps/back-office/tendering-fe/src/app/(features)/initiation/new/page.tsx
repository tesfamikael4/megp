'use client';
import React, { useEffect, useState } from 'react';
import DetailPRList from '../../_components/detail-pr-list';
import { Section, logger } from '@megp/core-fe';
import FormDetail from '../_components/form-detail';
import { useLazyListQuery } from '../_api/procurement-requisition.api';
import { LoadingOverlay } from '@mantine/core';
const ProcurementRequisitions = [
  {
    id: 'PR1',
    name: 'Procurement Requisitions',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et.',
    totalEstimatedAmount: 5467,
    organizationId: 'organizationId',
    calculatedAmount: 23498,
  },
];

export default function TenderingPage() {
  const [trigger, { data, isFetching }] = useLazyListQuery();
  const [selectedPR, setSelectedPR] = useState<string | null>();
  const [PRDetail, setPRDetail] = useState<string | null>();
  const onClickPRSelection = (value: string) => {
    setSelectedPR(value);
  };
  const onClickShowPRDetail = (value: string) => {
    if (PRDetail === value) {
      setPRDetail(null);
    } else {
      setPRDetail(value);
    }
  };
  useEffect(() => {
    logger.log('here');
    trigger({ skip: 0, take: 10 });
  }, [true]);
  return (
    <div className="w-full grid grid-cols-2 justify-between gap-2 items-start">
      <div className="bg-white rounded p-4">
        {data?.items && data?.items.length > 0 && (
          <div className="flex flex-col gap-3">
            <LoadingOverlay visible={isFetching} />
            {data?.items.map((item) => (
              <DetailPRList
                key={item.id}
                procurementRequisition={item}
                PRCategory="Goods"
                PRStage="Single Stage"
                PRType="Open"
                isDetailOpen={PRDetail === ProcurementRequisitions[0].id}
                isSelectedPr={selectedPR === ProcurementRequisitions[0].id}
                onClickSelectedPr={onClickPRSelection}
                onClickShowPrDetail={onClickShowPRDetail}
              />
            ))}
          </div>
        )}
      </div>
      <div className="w-full flex flex-col bg-white">
        <Section title="New Tender" collapsible={false}>
          <FormDetail />
        </Section>
      </div>
    </div>
  );
}
