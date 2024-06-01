'use client';

import { Box, Button, Group, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { ExpandableTable, ExpandableTableConfig } from '@megp/core-fe';
import { RulesModal } from './rules-modal';

export const ItemRule = () => {
  const [opened, { open, close }] = useDisclosure(false);

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
      <ExpandableTable config={config} data={[]} />
      <Group className="mt-2" justify="end">
        <Button>Save</Button>
      </Group>
      <Modal opened={opened} onClose={close} title="Add New Rule">
        <RulesModal />
      </Modal>
    </>
  );
};
