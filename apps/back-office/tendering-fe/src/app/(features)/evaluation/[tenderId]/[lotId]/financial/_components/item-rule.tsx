'use client';

import { Box, Button, Group, Modal, Select } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { ExpandableTable, ExpandableTableConfig, logger } from '@megp/core-fe';
import { useState } from 'react';

export const ItemRule = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const rulesList = [
    { name: 'Rule 1', id: 1 },
    { name: 'Rule 2', id: 2 },
    { name: 'Rule 3', id: 3 },
    { name: 'Rule 4', id: 4 },
  ];
  const [rules, setRules] = useState<any[]>([]);
  const config: ExpandableTableConfig = {
    minHeight: 100,
    isExpandable: true,
    columns: [
      {
        accessor: 'name',
      },
    ],
    expandedRowContent: (record, collapse) => {
      return (
        <Box className="p-5 bg-white">
          <p>Yeah</p>
        </Box>
      );
    },
  };
  return (
    <>
      {' '}
      <Button onClick={open} className="mb-2">
        Add Rule
      </Button>
      <ExpandableTable config={config} data={rules} />
      <Group className="mt-2" justify="end">
        <Button>Save</Button>
      </Group>
      <Modal opened={opened} onClose={close}>
        <Select
          label="Item Rules"
          data={rulesList.map((rule) => ({
            label: rule.name,
            value: rule.id.toString(),
          }))}
          onChange={(val, option) => {
            val !== null &&
              setRules([...rules, { name: option.label, id: option.value }]);
            close();
          }}
        />
      </Modal>
    </>
  );
};
