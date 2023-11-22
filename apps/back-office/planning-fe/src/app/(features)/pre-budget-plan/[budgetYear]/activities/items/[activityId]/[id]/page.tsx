'use client';

import { Box, Flex, Group, Text, Button } from '@mantine/core';
import { Section } from '@megp/core-fe';
import { IconChevronLeft, IconCoins, IconGift } from '@tabler/icons-react';
import { FormDetail } from '../_components/form-detail';
import { useLazyReadQuery } from '../../../(activities)/_api/activities.api';
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ItemsDetail() {
  const { activityId, budgetYear } = useParams();
  const [getActivity, { data: activity, isSuccess }] = useLazyReadQuery();
  const router = useRouter();

  useEffect(() => {
    getActivity(activityId as string);
  }, [activityId, getActivity]);
  return (
    <Box>
      <Section
        title={
          <>
            {isSuccess && (
              <Flex gap="xl">
                <Button
                  variant="outline"
                  leftSection={<IconChevronLeft size={18} />}
                  onClick={() =>
                    router.push(
                      `/pre-budget-plan/${budgetYear}/activities/items/${activityId}`,
                    )
                  }
                >
                  Items
                </Button>
                <Text fw={500}>Activity: {activity?.name}</Text>
                <Group>
                  <IconCoins />
                  <Text>
                    {activity?.currency} {activity?.totalEstimatedAmount}
                  </Text>
                </Group>
                <Group>
                  <IconGift />
                  <Text>Preference: {activity?.preference}</Text>
                </Group>
              </Flex>
            )}
          </>
        }
      >
        <FormDetail mode="detail" />
      </Section>
    </Box>
  );
}
