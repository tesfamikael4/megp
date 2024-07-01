'use client';

import { ActionIcon, Box, Button, Flex, Text } from '@mantine/core';
import { ExpandableTable, Section } from '@megp/core-fe';
import {
  IconChevronRight,
  IconDeviceFloppy,
  IconPlus,
  IconTrash,
} from '@tabler/icons-react';
import { useParams, useRouter } from 'next/navigation';
import ShipmentModal from './shipment-modal';
import { useDisclosure } from '@mantine/hooks';
import BudgetSource from './budget-source';
import Receiver from './receiver';
import AwardedItemList from './awarded-item';
import { useState } from 'react';
import { ItemDetailForm } from './item-detail-form';

const awards = [
  {
    name: 'First Award',
    version: '1st Version',
    vendor: '1st Vendor',
    status: 'Status',
  },
];

export default function ListOfItems({
  mode,
}: {
  mode: 'under-shipment' | 'under-po';
}) {
  // const [trigger, { data, isFetching }] = useLazyListQuery();
  const router = useRouter();
  const { id } = useParams();

  const [itemListOpened, { open: openItemList, close: closeItemList }] =
    useDisclosure();
  const [newItems, setNewItems] = useState<any[]>([]);

  const handelOnDone = (data, id, collapse) => {
    // logger.log({ data });
    const castedData = newItems.map((item) => {
      if (item.id == id) {
        return { ...item, ...data };
      }
      return item;
    });

    setNewItems(castedData);
    collapse();
  };

  const config = {
    columns: [
      { accessor: 'name', title: 'Name', width: 200 },
      { accessor: 'description', title: 'Description' },
      {
        accessor: 'shipment',
        title: 'Shipment',
        render: () => (
          <Flex gap={'xs'} align={'center'}>
            10 Shipment
            <Button variant="subtle" onClick={() => open()}>
              Add New
            </Button>
          </Flex>
        ),
      },

      {
        accessor: 'id',
        title: '',
        render: (rec) => (
          <ActionIcon
            variant="outline"
            onClick={() => router.push(`/purchase-order/${id}/item/${rec.id}`)}
          >
            <IconChevronRight />
          </ActionIcon>
        ),
        width: 50,
      },
    ],
    isExpandable: true,
    isSearchable: true,
    primaryColumn: 'name',
    // isFetching: isFetching,
    // expandedRowContent: () => {
    //     return <AwardDetail />;
    // },
  };
  const addConfig = {
    ...config,
    ...config,
    expandedRowContent: (record, collapse) => (
      <ItemDetailForm
        item={record}
        onDone={(data, id) => handelOnDone(data, id, collapse)}
      />
    ),
    columns: [
      ...config.columns,
      {
        title: '',
        accessor: 'actions',
        width: 50,
        render: (record) => (
          <>
            <ActionIcon
              color="red"
              size="sm"
              variant="subtle"
              onClick={(e) => {
                e.stopPropagation();
                const temp = newItems.filter((i) => i.id != record.id);
                setNewItems(temp);
              }}
              // disabled={disableFields}
            >
              <IconTrash size={14} />
            </ActionIcon>
          </>
        ),
      },
    ],
  };

  const onRequestChange = (request: any) => {
    // trigger(request);
  };

  return (
    <>
      <AwardedItemList opened={itemListOpened} close={closeItemList} />
      <Section
        title="Items"
        collapsible={false}
        action={
          <Button onClick={openItemList}>
            <IconPlus size={14} /> New
          </Button>
        }
      >
        {newItems.length !== 0 && (
          <>
            <Text className="text-lg" fw="500">
              New Items
            </Text>
            <ExpandableTable
              config={addConfig}
              data={newItems}
              total={newItems.length}
            />
            {/* <Table config={config} data={newItems} /> */}
            <Flex justify="end" className="my-2" gap="sm">
              <Button
              // onClick={handelOnSave}
              // loading={isPreAddingItems || isPostAddingItems}
              >
                <IconDeviceFloppy /> Save
              </Button>
              <Button variant="outline" onClick={() => setNewItems([])}>
                Reset
              </Button>
            </Flex>
          </>
        )}
        {(awards.length != 0 || newItems.length === 0) && (
          <Box className="">
            <ExpandableTable
              config={config}
              data={awards}
              total={0}
              onRequestChange={onRequestChange}
            />
          </Box>
        )}
      </Section>
    </>
  );
}
