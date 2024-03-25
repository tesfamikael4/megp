'use client';

import {
  useCreateAppMutation,
  useGetPreBudgetPlansQuery,
} from '@/store/api/pre-budget-plan/pre-budget-plan.api';
import {
  Loader,
  Center,
  Stack,
  Button,
  Modal,
  Group,
  Radio,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { notify } from '@megp/core-fe';

export default function PreBudgetPlan() {
  const { data: list, isSuccess } = useGetPreBudgetPlansQuery({} as any);
  const [opened, { open, close }] = useDisclosure(false);
  const router = useRouter();
  const [appCreate, { isLoading }] = useCreateAppMutation();
  const [type, setType] = useState<string>('');

  useEffect(() => {
    if (isSuccess && list !== undefined) {
      const temp = [...list.items];
      temp.length !== 0 &&
        router.push(`/pre-budget-plan/${temp[temp.length - 1]?.id}/activities`);
    }
  }, [list, isSuccess, router]);

  const onCreate = async () => {
    try {
      const res = await appCreate(type).unwrap();
      close();
      notify('Success', 'APP Created successfully');
      router.push(`/pre-budget-plan/${res.id}/activities`);
    } catch (err) {
      if (err.status === 430) {
        notify('Error', err.data.message);
      } else {
        notify('Error', 'Something went wrong');
      }
    }
  };
  return (
    <>
      <Center c="dimmed" className="h-full min-h-[300px]">
        <Stack align="center">
          {!list && <Loader />}
          {list?.items?.length == 0 && (
            <>
              <p className="text-black">Create New Annual Procurement Plan</p>
              <Button onClick={open} variant="outline">
                Create New APP
              </Button>
            </>
          )}
        </Stack>
      </Center>

      <Modal
        opened={opened}
        onClose={close}
        title="New Annual Procurement Plan"
      >
        <p className=" mb-4">Select budget year</p>
        <Group gap="md">
          <Radio
            label="Current Year"
            checked={type === 'current'}
            onChange={() => setType('current')}
          />
          <Radio
            label="Next Year"
            checked={type === 'next'}
            onChange={() => setType('next')}
          />
        </Group>
        <Button onClick={onCreate} loading={isLoading} className="mt-5">
          Create
        </Button>
      </Modal>
    </>
  );
}
