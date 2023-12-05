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
  Text,
  Group,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { logger } from '@megp/core-fe';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { FormDetail } from '../../_components/form-detail';
import { notifications } from '@mantine/notifications';

export default function PreBudgetPlan() {
  const { data: list, isSuccess } = useGetPreBudgetPlansQuery({} as any);
  const [opened, { open, close }] = useDisclosure(false);
  const router = useRouter();
  const [appCreate, { isLoading }] = useCreateAppMutation();

  useEffect(() => {
    if (isSuccess && list !== undefined) {
      const temp = [...list.items];
      temp.length !== 0 &&
        router.push(`/pre-budget-plan/${temp[temp.length - 1]?.id}/activities`);
    }
  }, [list, isSuccess, router]);

  const onCreate = async (type) => {
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
        {/* <FormDetail mode="new" /> */}
        <p className="text-center mb-4">Select budget year</p>
        <Group gap="md" justify="center">
          <Button onClick={() => onCreate('current')} loading={isLoading}>
            Current Year
          </Button>
          <Button
            onClick={() => onCreate('next')}
            variant="outline"
            loading={isLoading}
          >
            Next Year
          </Button>
        </Group>
      </Modal>
    </>
  );
}
