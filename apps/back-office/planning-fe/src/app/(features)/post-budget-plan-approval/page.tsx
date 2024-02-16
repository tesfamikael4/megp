'use client';

import { useRouter } from 'next/navigation';
import { Loader } from '@mantine/core';
import { useEffect } from 'react';
import { useLazyGetPostBudgetPlansQuery } from '@/store/api/post-budget-plan/post-budget-plan.api';

export default function PreBudgetPlanApproval() {
  const [getPlan, { data, isSuccess, isLoading }] =
    useLazyGetPostBudgetPlansQuery();
  const router = useRouter();

  useEffect(() => {
    getPlan({
      where: [
        [
          {
            column: 'status',
            value: 'Submitted',
            operator: '=',
          },
        ],
      ],
    });
  }, []);

  useEffect(() => {
    if (isSuccess && data.total > 0) {
      router.push(`/post-budget-plan-approval/${data.items[0].id}`);
    }
  }, [isSuccess, data, router]);

  return (
    <div className=" flex justify-center items-center h-[80vh] w-full">
      {isLoading && <Loader />}
      {data?.total == 0 && <p>No Submitted Post Budget Plan Found</p>}
    </div>
  );
}
