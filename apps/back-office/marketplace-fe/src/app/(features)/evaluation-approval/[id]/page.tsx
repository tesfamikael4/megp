'use client';

import { useParams } from 'next/navigation';
import { Box, Flex, Stack } from '@mantine/core';
import { useContext } from 'react';
import { Section } from '@megp/core-fe';
import { WorkflowHandling } from '../../_components/workflow';
import { StatusContext } from '@/contexts/rfx-status.context';
import { DetailTable } from '../../rfx/_components/detail-table';
import QualificationCriterion from '../_components/qualification-criterion.component';
import Items from '../_components/items.component';

export default function WorkflowPage() {
  const { id } = useParams();

  const { data: rfq } = useContext(StatusContext);

  const rfqConfig = [
    {
      key: 'Reference Number',
      value: `${rfq?.procurementReferenceNumber}`,
    },
    {
      key: 'Title',
      value: `${rfq?.name}`,
    },
    {
      key: 'Description',
      value: `${rfq?.description}`,
    },
    {
      key: 'Calculated Amount',
      value: `${rfq?.budgetAmount.toLocaleString('en-US', {
        style: 'currency',
        currency: rfq?.budgetAmountCurrency ?? 'MKW',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        currencyDisplay: 'code',
      })}`,
    },
  ];

  return (
    <Box className="min-h-screen">
      <Flex>
        <Stack className="w-4/5">
          <p className="font-bold text-xl">RFQ</p>
          <Section title={rfq?.name}>
            <Stack>
              <DetailTable data={rfqConfig} />
              <p className="font-medium text-xl">Qualification Criterion</p>
              <QualificationCriterion />
            </Stack>
          </Section>
          <p className="font-bold text-xl">Items</p>
          <Items />
        </Stack>
        <Box className="w-1/5">
          <WorkflowHandling
            itemId={id as string}
            itemKey={'RFQEvaluationApproval'}
          />
        </Box>
      </Flex>
    </Box>
  );
}
