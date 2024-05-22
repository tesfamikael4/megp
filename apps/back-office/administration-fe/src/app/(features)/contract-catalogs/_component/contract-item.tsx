import {
  LoadingOverlay,
  Button,
  ActionIcon,
  Box,
  Text,
  Menu,
  MenuTarget,
  MenuDropdown,
  Flex,
  Collapse,
  Group,
} from '@mantine/core';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useDisclosure } from '@mantine/hooks';
import { ExpandableTable, Section, logger, notify } from '@megp/core-fe';
import ItemSelector from './Item-selector';

import CreateContractItem from './new-contract-item';
import {
  IconCirclePlus,
  IconDeviceFloppy,
  IconDotsVertical,
  IconPlus,
  IconTrash,
} from '@tabler/icons-react';
import {
  useCreateMutation,
  useLazyListByIdQuery,
} from '../_api/contract-item.api';
import RenderDescription from './render-item-description';

interface ContractItem {
  maximumQuantity: number;
  utilizedQuantity: number;
}

export default function ContractItem() {
  const { id } = useParams();
  const router = useRouter();
  const [opened, { open, close }] = useDisclosure();
  const [newItems, setNewItems] = useState<any[]>([]);

  const [error, setError] = useState(false);

  const [create, { isLoading: isSaving }] = useCreateMutation();

  const [listItem, { data: itemList }] = useLazyListByIdQuery();

  useEffect(() => {
    listItem({ id: id?.toString(), collectionQuery: undefined });
  }, [id]);

  const handleDone = (item) => {
    const castedData = {
      description: item.description,
      specification: item.specification,
      itemCode: item.itemCode,
      itemMasterId: item.id,
    };

    setNewItems([castedData, ...newItems]);
  };

  const handleOnDone = (data, id, collapse) => {
    logger.log(data, id);
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
    isExpandable: true,
    columns: [
      {
        accessor: 'description',
        render: (record) => <RenderDescription record={record} />,
      },
      {
        accessor: 'maximumQuantity',
      },
      {
        accessor: 'utilizedQuantity',
      },
    ],
    expandedRowContent: (record, Collapse) => (
      <CreateContractItem
        contractItem={record}
        onDone={(data, id) => handleOnDone(data, id, Collapse)}
      />
    ),
  };
  const newItemConfig = {
    ...config,
    columns: [
      ...config.columns,
      {
        title: '',
        accessor: 'actions',
        render: (record) => (
          <Group
            onClick={(e) => {
              e.stopPropagation();
              const temp = newItems.filter((i) => i.id != record.id);
              setNewItems(temp);
            }}
          >
            <IconTrash size={14} color="red" />
          </Group>
        ),
      },
    ],
  };
  const addConfig = {
    ...config,
    columns: [
      ...config.columns,
      {
        title: '',
        accessor: 'actions',
        width: 50,
        render: (record) => (
          <Box className="ml-auto">
            <Menu>
              <MenuTarget>
                <IconDotsVertical
                  size={15}
                  onClick={(e) => e.stopPropagation()}
                />
              </MenuTarget>
              <MenuDropdown>
                <Menu.Item
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(
                      `/contract-catalogs/${id}/items/${record.id}/price/new`,
                    );
                  }}
                >
                  <Group>
                    <IconPlus size={14} /> Add item price
                  </Group>
                </Menu.Item>
                <Menu.Item
                  color="red"
                  onClick={(e) => {
                    e.stopPropagation();
                    const temp = newItems.filter((i) => i.id != record.id);
                    setNewItems(temp);
                  }}
                >
                  <Group>
                    {' '}
                    <IconTrash size={14} />
                    Delete
                  </Group>
                </Menu.Item>
              </MenuDropdown>
            </Menu>
          </Box>
        ),
      },
    ],
  };

  logger.log(newItems, 'item');
  const handelOnSave = async () => {
    logger.log(newItems, 'newItems');
    newItems.map((item) => {
      if (item.maximumQuantity <= 0 || item.utilizedQuantity <= 0) {
        setError(true);
      }
    });

    if (!error) {
      logger.log(newItems, 'newItems');
      try {
        const castedData = newItems?.map((item) => {
          return {
            maximumQuantity: item.maximumQuantity,
            utilizedQuantity: item.utilizedQuantity,
            itemMasterId: item.itemMasterId,
            contractCatalogId: id,
            specification: item.specification,
          };
        });
        await create(castedData).unwrap();

        notify('Success', 'Items Created Success-fully');
        setNewItems([]);
      } catch (err) {
        if (err.data.statusCode === 430) {
          notify('Error', err.data.message);
        } else {
          notify('Error', 'Something went wrong');
        }
      }
    }
  };

  return (
    <Section
      title="Contract Items"
      collapsible={false}
      action={
        <Button onClick={open}>
          {' '}
          <IconCirclePlus className="me-1" />
          Add Item
        </Button>
      }
    >
      <Box>
        {newItems.length !== 0 && (
          <>
            <Text className="text-lg" fw="500">
              New Contract Items
            </Text>
            <ExpandableTable config={newItemConfig} data={newItems} />

            <Flex justify="end" className="my-2" gap="sm">
              <Button
                onClick={handelOnSave}
                loading={isSaving}
                className="ml-auto"
              >
                <IconDeviceFloppy /> Save
              </Button>
              <Button variant="outline" onClick={() => setNewItems([])}>
                Reset
              </Button>
            </Flex>
          </>
        )}
        {(itemList?.total != 0 || newItems.length === 0) && (
          <Box pos={'relative'}>
            <LoadingOverlay />

            <ExpandableTable config={addConfig} data={itemList?.items || []} />
          </Box>
        )}

        <ItemSelector onDone={handleDone} opened={opened} close={close} />
      </Box>
    </Section>
  );
}
