'use client';

import {
  useGetPreviousPlanQuery,
  useLazyGetPreviousVersionsQuery,
} from '@/store/api/post-budget-plan/post-budget-plan.api';
import { ActionIcon, Button, Flex, Group, Modal, Select } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconHistory } from '@tabler/icons-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export const HistoryBtn = () => {
  const [opened, { open, close }] = useDisclosure();
  const router = useRouter();
  const { budgetYear } = useParams();
  const { data: previousPlans } = useGetPreviousPlanQuery(budgetYear);
  const [getPrevVer, { data: previousVersions }] =
    useLazyGetPreviousVersionsQuery();
  const [toBeCompare, setToBeCompare] = useState<string | null>(null);
  const [comparedWith, setComparedWith] = useState<string | null>(null);

  useEffect(() => {
    if (toBeCompare) {
      getPrevVer(toBeCompare);
    }
  }, [getPrevVer, toBeCompare]);
  return (
    <>
      <ActionIcon variant="subtle" onClick={open}>
        <IconHistory size={14} />
      </ActionIcon>

      <Modal opened={opened} onClose={close} title="Compare">
        <Flex gap={10} align="center">
          <Select
            value={toBeCompare}
            onChange={setToBeCompare}
            label="Select to compare"
            className="w-full"
            data={
              previousPlans?.map((plan) => ({
                value: plan.id,
                label: `Version ${plan.version}`,
              })) ?? []
            }
          />
          <Select
            value={comparedWith}
            onChange={setComparedWith}
            label="Select Previous"
            className="w-full"
            disabled={!toBeCompare}
            data={
              previousVersions?.map((plan) => ({
                value: plan.id,
                label: `Version ${plan.version}`,
              })) ?? []
            }
          />
        </Flex>
        <Group className="mt-2" justify="end">
          <Button
            disabled={!comparedWith || !toBeCompare}
            onClick={() => {
              close();
              router.push(
                `/post-budget-plan/${budgetYear}/history/${toBeCompare}/${comparedWith}`,
              );
            }}
          >
            Compare
          </Button>
        </Group>
      </Modal>
    </>
  );
};
