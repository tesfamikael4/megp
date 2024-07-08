'use client';

import { useParams } from 'next/navigation';
import { Box, Button, Flex, Stack, Tooltip } from '@mantine/core';
import { useContext } from 'react';
import { Section } from '@megp/core-fe';
import { WorkflowHandling } from '../../_components/workflow';
import { StatusContext } from '@/contexts/rfx-status.context';
import { DetailTable } from '../../rfx/_components/detail-table';
import QualificationCriterion from '../_components/qualification-criterion.component';
import Items from '../_components/items.component';
import { useCanCompleteEvaluationQuery } from '@/store/api/rfx/eval-approval.api';

export default function WorkflowPage() {
  const { id } = useParams();
  const { data: canComplete } = useCanCompleteEvaluationQuery({
    rfxId: id.toString(),
  });

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
          <Section title={rfq?.name} defaultCollapsed>
            <Stack>
              <DetailTable data={rfqConfig} />
              <p className="font-medium text-xl">Qualification Criterion</p>
              <QualificationCriterion />
            </Stack>
          </Section>
          <Flex className="justify-between">
            <p className="font-bold text-xl">Items</p>
            <Tooltip label={canComplete?.reason} hidden={!canComplete?.reason}>
              <Button className="mr-4" disabled={!canComplete?.canSubmit}>
                Complete
              </Button>
            </Tooltip>
          </Flex>
          <Items />
        </Stack>
        <Box className="w-1/5">
          <WorkflowHandling
            itemId={id as string}
            itemKey={'RFQEvaluationApproval'}
            isDisabled={!canComplete?.canSubmit}
          />
        </Box>
      </Flex>
    </Box>
  );
}
