'use client';

import { Loader, Center, Stack, Text } from '@mantine/core';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useGetPostBudgetPlansQuery } from '@/store/api/post-budget-plan/post-budget-plan.api';
import { IconInboxOff } from '@tabler/icons-react';

export default function PreBudgetPlan() {
  const { data: list, isSuccess } = useGetPostBudgetPlansQuery({} as any);
  const router = useRouter();

  useEffect(() => {
    if (isSuccess && list !== undefined) {
      const temp = [...list.items];
      temp.length !== 0 &&
        router.push(
          `/post-budget-plan/${temp[temp.length - 1]?.id}/activities`,
        );
    }
  }, [list, isSuccess, router]);
  return (
    <>
      <Center c="dimmed" className="h-full min-h-[300px]">
        <Stack align="center">
          {!list && <Loader />}
          {list?.items?.length == 0 && (
            <>
              <IconInboxOff size={60} />
              <Text color="black">Pre-Budget Plan not approved yet</Text>
            </>
          )}
        </Stack>
      </Center>
    </>
  );
}
