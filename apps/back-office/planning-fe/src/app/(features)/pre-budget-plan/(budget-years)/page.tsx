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
import { notifications } from '@mantine/notifications';

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
      notifications.show({
        title: 'Success',
        message: 'APP Created successfully',
        color: 'green',
      });
      router.push(`/pre-budget-plan/${res.id}/activities`);
    } catch (err) {
      notifications.show({
        title: 'Error',
        message: 'Something went wrong',
        color: 'red',
      });
    }
  };
  return (
    <>
      <Center c="dimmed" className="h-full min-h-[300px]">
        <Stack align="center">
          {!list && <Loader />}
          {list?.items?.length == 0 && (
            <>
              <p className="text-black">
                Lorem ipsum is placeholder text commonly used in the graphic,
                print, and publishing industries for previewing layouts and
                visual mockups.
              </p>
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
