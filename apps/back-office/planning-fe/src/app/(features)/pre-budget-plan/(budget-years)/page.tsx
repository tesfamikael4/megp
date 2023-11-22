'use client';

import { useGetPreBudgetPlansQuery } from '@/store/api/pre-budget-plan/pre-budget-plan.api';
import { Loader } from '@mantine/core';
import { logger } from '@megp/core-fe';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function PreBudgetPlan() {
  const { data: list, isSuccess } = useGetPreBudgetPlansQuery({} as any);
  const router = useRouter();

  useEffect(() => {
    if (isSuccess && list !== undefined) {
      const temp = [...list.items];
      router.push(`/pre-budget-plan/${temp[temp.length - 1]?.id}/activities`);
    }
  }, [list, isSuccess, router]);
  return (
    <>
      <Loader />
    </>
  );
}
