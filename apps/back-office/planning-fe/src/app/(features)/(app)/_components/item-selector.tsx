import React, { useEffect, useState } from 'react';
import { Box, Modal, Tooltip, Flex, Text, Button, Group } from '@mantine/core';
import { IconBinaryTree, IconColumns, IconPlus } from '@tabler/icons-react';
import {
  useGetClassificationsQuery,
  useLazyGetClassificationsQuery,
  useLazyGetItemMasterQuery,
} from '@/store/api/administration/administration.api';
import { NewItem } from './new-item-form';
import { ExpandableTable } from '../../_components/expandable-table';
import { DetailItem } from './deatil-item';
import { MantineTree, TreeConfig, logger } from '@megp/core-fe';

interface ItemSelectorProps {
  onDone: (item: any) => void;
  opened: boolean;
  close: () => void;
}

const ItemSelector = ({ onDone, opened, close }: ItemSelectorProps) => {
  //states
  const [mode, setMode] = useState<'tree' | 'table' | 'new'>('table');
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [itemCollectionSelector, setItemCollectionSelector] = useState<any[]>(
    [],
  );

  //rtk queries
  const [getItemMaster, { data: list }] = useLazyGetItemMasterQuery();
  const { data: classifications } = useGetClassificationsQuery({
    where: [
      [
        {
          column: 'parentCode',
          value: 'IsNull',
          operator: 'IsNull',
        },
      ],
    ],
  } as any);
  const [getChildren, { isLoading }] = useLazyGetClassificationsQuery();

  //variables
  const config = {
    isSearchable: true,
    primaryColumn: 'description',
    columns: [{ accessor: 'description' }],
    isExpandable: true,
    expandedRowContent: (record) => <DetailItem data={record} />,
    selectedItems: selectedItems,
    setSelectedItems: setSelectedItems,
    isSelectable: true,
  };

  const treeConfig: TreeConfig<any> = {
    id: 'id',
    label: 'title',
    onClick: async (data) => {
      logger.log({ data });
      setItemCollectionSelector([
        {
          column: 'itemMetaData.code',
          value: data.code,
          operator: '=',
        },
      ]);
    },
    load: async (data) => {
      const res = await getChildren({
        where: [
          [
            {
              column: 'parentCode',
              value: data.code,
              operator: '=',
            },
          ],
        ],
      }).unwrap();
      return {
        result: res?.items ?? [],
        loading: isLoading,
      };
    },
  };
  const changeMode = () => {
    mode === 'table' ? setMode('tree') : setMode('table');
  };

  useEffect(() => {
    setMode('table');
  }, [opened]);

  useEffect(() => {
    getItemMaster({
      skip: 0,
      take: 10,
      where: [itemCollectionSelector],
      includes: ['itemMetaData'],
    });
  }, [getItemMaster, itemCollectionSelector]);

  return (
    <>
      <Modal
        title={
          <Flex justify="space-between" className="w-full">
            <Group>
              <Text className="font-bold">Item Selector</Text>
            </Group>

            <Group>
              <Tooltip label={mode == 'table' ? 'Tree View' : 'Grid View'}>
                <Box
                  className="text-slate-600 cursor-pointer"
                  onClick={() => {
                    changeMode();
                    setItemCollectionSelector([]);
                  }}
                >
                  {mode == 'table' ? <IconBinaryTree /> : <IconColumns />}
                </Box>
              </Tooltip>
              <Tooltip label="Add new item">
                <Box
                  className="text-slate-600 cursor-pointer"
                  onClick={() => setMode('new')}
                >
                  <IconPlus />
                </Box>
              </Tooltip>
            </Group>
          </Flex>
        }
        styles={{
          close: {
            width: 'fit-content',
          },
          title: {
            width: '100%',
          },
        }}
        opened={opened}
        size={mode == 'tree' ? '75%' : 'lg'}
        onClose={close}
      >
        <Box>
          {mode == 'new' && (
            <NewItem
              onDone={(data) => {
                onDone([data]);
                close();
              }}
            />
          )}
          {mode != 'new' && (
            <>
              <Flex className="max-h-[30rem]">
                {mode === 'tree' && (
                  <Box className="border-t-2 w-2/5 ">
                    <MantineTree
                      data={classifications ? classifications.items : []}
                      config={treeConfig}
                    />
                  </Box>
                )}

                <Box
                  className={
                    mode == 'tree' ? 'border-l-2 pl-2 w-3/5' : 'w-full'
                  }
                >
                  <ExpandableTable
                    config={config}
                    data={list ? list?.items : []}
                    total={list ? list.total : 0}
                    onRequestChange={(collectionQuery) => {
                      logger.log({
                        collectionQuery: {
                          collectionQuery,
                          where: [
                            ...collectionQuery.where,

                            itemCollectionSelector,
                          ],
                          includes: ['itemMetaData'],
                        },
                      });
                      getItemMaster(collectionQuery);
                    }}
                  />
                </Box>
              </Flex>
              <Group justify="end" mt={40}>
                <Button
                  onClick={() => {
                    onDone(selectedItems);
                    close();
                  }}
                >
                  Done
                </Button>
              </Group>
            </>
          )}
        </Box>
      </Modal>
    </>
  );
};

export default ItemSelector;
