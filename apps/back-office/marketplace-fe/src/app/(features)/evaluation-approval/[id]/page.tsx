'use client';

import { useParams } from 'next/navigation';
import { Box, Button, Flex, Stack, Tooltip } from '@mantine/core';
import { useContext, useEffect } from 'react';
import { Section } from '@megp/core-fe';
import { WorkflowHandling } from '../../_components/workflow';
import { StatusContext } from '@/contexts/rfx-status.context';
import { DetailTable } from '../../rfx/_components/detail-table';
import QualificationCriterion from '../_components/qualification-criterion.component';
import Items from '../_components/items.component';
import {
  useCanCompleteEvaluationQuery,
  useCompleteEvaluationMutation,
  useLazyGetEvaluationStatusQuery,
} from '@/store/api/rfx/eval-approval.api';
import { notifications } from '@mantine/notifications';

export default function WorkflowPage() {
  const { id } = useParams();
  const { data: rfq, currentStep } = useContext(StatusContext);
  const { data: canComplete } = useCanCompleteEvaluationQuery({
    rfxId: id.toString(),
    step: currentStep?.instanceStep?.order,
  });
  const [getEvaluationStatus, { data: isComplete }] =
    useLazyGetEvaluationStatusQuery();
  const [completeEvaluation, { isLoading: isCompleting }] =
    useCompleteEvaluationMutation();

  useEffect(() => {
    if (currentStep)
      getEvaluationStatus({
        objectId: id.toString(),
        step: currentStep?.instanceStep?.order,
      });
  }, [currentStep]);

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

  const handleComplete = async () => {
    try {
      await completeEvaluation({
        objectId: id.toString(),
        step: currentStep?.instanceStep?.order,
      }).unwrap();
    } catch (err: any) {
      notifications.show({
        title: 'Error',
        message: err.message,
        color: 'red',
      });
    }
  };

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
              <Button
                className="mr-4"
                disabled={!canComplete?.canSubmit}
                onClick={handleComplete}
                loading={isCompleting}
              >
                Complete
              </Button>
            </Tooltip>
          </Flex>
          <Items isComplete={isComplete?.isComplete} />
        </Stack>
        <Box className="w-1/5">
          <WorkflowHandling
            itemId={id as string}
            itemKey={'RFQEvaluationApproval'}
            isDisabled={!isComplete?.isComplete}
          />
        </Box>
      </Flex>
    </Box>
  );
}
