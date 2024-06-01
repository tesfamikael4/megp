'use client';

import { Button, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { ExpandableTable, ExpandableTableConfig } from '@megp/core-fe';
import { RulesModal } from './rules-modal';
import { useParams } from 'next/navigation';
import { useGetRulesByLotIdQuery } from '@/store/api/tendering/bid-price-evaluation';

export const ItemRule = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const { lotId } = useParams();

  const config: ExpandableTableConfig = {
    minHeight: 100,
    columns: [
      {
        accessor: 'name',
      },
      {
        accessor: 'type',
      },
      {
        accessor: 'representation',
      },
    ],
  };

  //rtk
  const { data } = useGetRulesByLotIdQuery(lotId);
  return (
    <>
      {' '}
      <Button onClick={open} className="mb-2">
        Add Rule
      </Button>
      <ExpandableTable config={config} data={data?.items ?? []} />
      {/* <Group className="mt-2" justify="end">
        <Button>Save</Button>
      </Group> */}
      <Modal opened={opened} onClose={close} title="Add New Rule">
        <RulesModal close={close} />
      </Modal>
    </>
  );
};
