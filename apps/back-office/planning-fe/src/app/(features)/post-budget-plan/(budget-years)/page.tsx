'use client';

import { useGetPreBudgetPlansQuery } from '@/store/api/pre-budget-plan/pre-budget-plan.api';
import { Loader, Center, Stack, Button, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { logger } from '@megp/core-fe';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { FormDetail } from '../../_components/form-detail';

export default function PreBudgetPlan() {
  const { data: list, isSuccess } = useGetPreBudgetPlansQuery({} as any);
  const [opened, { open, close }] = useDisclosure(false);
  const router = useRouter();

  useEffect(() => {
    if (isSuccess && list !== undefined) {
      const temp = [...list.items];
      router.push(`/post-budget-plan/${temp[temp.length - 1]?.id}/activities`);
    }
  }, [list, isSuccess, router]);
  return (
    <>
      <Center c="dimmed" className="h-full min-h-[300px]">
        <Stack align="center">
          {!list && <Loader />}
          {list?.items?.length == 0 && (
            <Button onClick={open} variant="outline">
              Create New APP
            </Button>
          )}
        </Stack>
      </Center>

      <Modal
        opened={opened}
        onClose={close}
        title="New Annual Procurement Plan"
      >
        <FormDetail mode="new" />
      </Modal>
    </>
  );
}
