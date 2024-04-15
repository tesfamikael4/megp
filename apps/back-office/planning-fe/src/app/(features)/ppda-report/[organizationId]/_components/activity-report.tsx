'use client';

import { Box, LoadingOverlay } from '@mantine/core';
import { useLazyListByIdQuery } from '../../../(app)/post-budget-plan/[budgetYear]/activities/_api/activities.api';
import { useEffect } from 'react';

import { PdfReport } from './pdf-tamplate';

export const ActivityReport = ({
  planYearId,
  withItems = false,
  withTimeline = false,
  withRequisitioner = false,
}: {
  planYearId: string | null | undefined;
  withItems?: boolean;
  withRequisitioner?: boolean;
  withTimeline?: boolean;
}) => {
  const [getActivities, { data: activities, isLoading: isActivitiesLoading }] =
    useLazyListByIdQuery();

  useEffect(() => {
    const includes: string[] = [];
    if (withItems) {
      includes.push('postBudgetPlanItems');
    }
    if (withTimeline) {
      includes.push('postBudgetPlanTimelines');
    }
    if (withRequisitioner) {
      includes.push('postBudgetRequisitioners');
    }
    if (planYearId) {
      getActivities({
        id: planYearId,
        collectionQuery: { includes: includes },
      });
    }
  }, [getActivities, planYearId, withItems, withRequisitioner, withTimeline]);

  return (
    <Box className="bg-white p-5" mih={300} pos="relative">
      <LoadingOverlay visible={isActivitiesLoading} />
      {activities && <PdfReport activities={activities?.items ?? []} />}
    </Box>
  );
};
