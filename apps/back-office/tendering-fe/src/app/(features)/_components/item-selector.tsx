import React, { useEffect, useState } from 'react';
import { Box, Modal, Tooltip, Flex, Text, Button, Group } from '@mantine/core';
import { IconBinaryTree, IconColumns, IconPlus } from '@tabler/icons-react';
import { Tree } from '@megp/core-fe';
import {
  useGetClassificationsQuery,
  useLazyGetItemMasterQuery,
} from '@/store/api/administration/administration.api';
import { NewItem } from './new-item-form';
import { ExpandableTable } from './expandable-table';
import { DetailItem } from './deatil-item';

interface ItemSelectorProps {
  onDone: (item: any) => void;
  opened: boolean;
  close: () => void;
}

const ItemSelector = ({ onDone, opened, close }: ItemSelectorProps) => {
  //states
  const [mode, setMode] = useState<'tree' | 'table' | 'new'>('table');
  const [selectedItems, setSelectedItems] = useState<any[]>([]);

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

  const changeMode = () => {
    mode === 'table' ? setMode('tree') : setMode('table');
  };

  useEffect(() => {
    setMode('table');
  }, [opened]);

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
                  onClick={changeMode}
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
              <Flex className="max-h-[40rem] overflow-y-scroll">
                {mode === 'tree' && (
                  <Box className="border-t-2 overflow-y-scroll w-2/5 ">
                    <Tree
                      fieldNames={{ title: 'title', key: 'code' }}
                      data={classifications ? classifications.items : []}
                      mode="view"
                      disableModal
                      disableParentSelect
                      url={(code) =>
                        `${
                          process.env.NEXT_PUBLIC_ADMINISTRATION_API ??
                          '/administration/api/'
                        }classifications?q=w%3DparentCode%3A%3D%3A${code}`
                      }
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
                    data={list ? list.items : []}
                    total={list ? list.total : 0}
                    onRequestChange={(collectionQuery) => {
                      getItemMaster(collectionQuery);
                    }}
                  />
                </Box>
              </Flex>
              <Group justify="end">
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
