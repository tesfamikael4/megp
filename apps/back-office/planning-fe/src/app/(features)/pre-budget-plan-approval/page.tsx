'use client';

import { useRouter } from 'next/navigation';
import { Loader } from '@mantine/core';
import { useLazyGetPreBudgetPlansQuery } from '@/store/api/pre-budget-plan/pre-budget-plan.api';
import { useEffect } from 'react';

export default function PreBudgetPlanApproval() {
  const [getPlan, { data, isSuccess, isLoading }] =
    useLazyGetPreBudgetPlansQuery();
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
      router.push(`/pre-budget-plan-approval/${data.items[0].id}`);
    }
  }, [isSuccess, data, router]);

  return (
    <div className=" flex justify-center items-center h-[80vh] w-full">
      {isLoading && <Loader />}
      {data?.total == 0 && <p>No Submitted Pre Budget Plan Found</p>}
    </div>
  );
}
