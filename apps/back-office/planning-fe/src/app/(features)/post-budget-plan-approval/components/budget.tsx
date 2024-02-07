'use client';

import { Box, TextInput } from '@mantine/core';
import { useEffect } from 'react';
import { useLazyListByIdQuery } from '../../budget/_api/budget.api';
import { useLazyGetPostBudgetPlansQuery } from '@/store/api/post-budget-plan/post-budget-plan.api';

export const Budget = ({ activity, postBudgetId }: any) => {
  const [getSelectedData, { data: selectedData }] = useLazyListByIdQuery();
  const [getPost, { data: postBudgetPlan, isSuccess }] =
    useLazyGetPostBudgetPlansQuery();

  useEffect(() => {
    getPost({
      where: [[{ column: 'id', operator: '=', value: postBudgetId }]],
    });
  }, [getPost, postBudgetId]);

  useEffect(() => {
    if (isSuccess && postBudgetPlan) {
      getSelectedData({
        id: postBudgetPlan.items[0]?.appId,
        collectionQuery: {
          where: [[{ column: 'id', operator: '=', value: activity.budgetId }]],
        },
      });
    }
  }, [activity, getSelectedData, isSuccess, postBudgetPlan]);
  return (
    <Box className="p-2">
      <TextInput
        disabled
        label="Budget Line"
        value={selectedData?.items?.[0]?.budgetCode}
      />
    </Box>
  );
};
