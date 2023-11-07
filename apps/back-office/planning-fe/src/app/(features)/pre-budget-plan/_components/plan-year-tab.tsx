'use client';

import { Box, Button, Flex, Group, Text } from '@mantine/core';
import { Section } from '@megp/core-fe';
import {
  IconCoins,
  IconPennantFilled,
  IconPercentage,
  IconTrekking,
} from '@tabler/icons-react';

export const PlanYearTab = () => {
  return (
    <Box>
      <Flex>
        <Box className="w-fit px-3 py-1 bg-white cursor-pointer border hover:shadow-lg">
          2023
        </Box>
        <Box className="w-fit px-3 py-1 bg-white cursor-pointer border hover:shadow-lg">
          2024
        </Box>
      </Flex>
      <Section
        collapsible={false}
        title="Annual Procurement Plan 2023 (Pre-Budget)"
        action={<Button>Submit</Button>}
        className="mb-2"
      >
        <Flex justify="space-between">
          <Group>
            <IconCoins />
            <Text>USD, 1,525,520.68</Text>
          </Group>
          <Group>
            <IconPercentage />
            <Text> 71 % Indigenous</Text>
          </Group>
          <Group>
            <IconTrekking />
            <Text> 27 Activities</Text>
          </Group>
          <Group>
            <IconPennantFilled />
            <Text> Draft</Text>
          </Group>
        </Flex>
      </Section>
    </Box>
  );
};
