import {
  ActionIcon,
  Box,
  Button,
  Checkbox,
  Divider,
  Flex,
  Group,
  Popover,
} from '@mantine/core';
import { IconFilter } from '@tabler/icons-react';

export const Filter = () => {
  return (
    <Popover position="bottom" withArrow shadow="md">
      <Popover.Target>
        <ActionIcon variant="outline">
          <IconFilter size={14} />
        </ActionIcon>
      </Popover.Target>
      <Popover.Dropdown>
        <Divider label="Filter by procurement type" />
        <Flex gap={10}>
          <Box>
            <Checkbox label="Goods" className="mt-2" />
            <Checkbox label="Works" className="mt-2" />
          </Box>
          <Box>
            <Checkbox label="Non Consulting Services" className="mt-2" />
            <Checkbox label="Consultancy Services" className="mt-2" />
          </Box>
        </Flex>
        <Checkbox label="Motor Vehicle Repair" className="mt-2" />
        <Divider label="Filter by funding source" />
        <Flex gap={10}>
          <Box>
            <Checkbox label="Treasury" className="mt-2" />
            <Checkbox label="Internal Revenue" className="mt-2" />
          </Box>
          <Box>
            <Checkbox label="Donor" className="mt-2" />
            <Checkbox label="Loan" className="mt-2" />
          </Box>
        </Flex>
        <Group className="mt-2" justify="end" gap={4}>
          <Button variant="outline">Clear</Button>
          <Button>Filter</Button>
        </Group>
      </Popover.Dropdown>
    </Popover>
  );
};
