import React, { useEffect, useState } from 'react';
import {
  Box,
  Modal,
  Tooltip,
  Flex,
  Text,
  Button,
  ActionIcon,
  Group,
  Radio,
} from '@mantine/core';
import {
  IconBinaryTree,
  IconChevronLeft,
  IconChevronRight,
  IconColumns,
  IconPlus,
} from '@tabler/icons-react';
import { TableConfig, Tree } from '@megp/core-fe';
import {
  useGetClassificationsQuery,
  useLazyGetItemMasterQuery,
} from '@/store/api/administration/administration.api';
import { NewItem } from './new-item-form';
import { DetailTable } from './detail-table';
import { CollectionSelector } from './collection-selector';

interface ItemSelectorProps {
  onDone: (item: any) => void;
  opened: boolean;
  close: () => void;
}

const ItemSelector = ({ onDone, opened, close }: ItemSelectorProps) => {
  const [mode, setMode] = useState<'tree' | 'table' | 'new'>('table');
  const [selector, setItemSelector] = useState<
    'item-master' | 'price-index' | undefined
  >(undefined);
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
  const [detail, setDetail] = useState(undefined);
  const addConfig: TableConfig<any> = {
    // title: 'Items',
    columns: [
      {
        id: 'name',
        header: 'Items',
        accessorKey: 'description',
        cell: (info) => info.getValue(),
        meta: {
          widget: 'primary',
        },
      },
      {
        id: 'action',
        header: '',
        accessorKey: 'action',
        cell: ({ row: { original } }: any) => (
          <ActionIcon variant="transparent" onClick={() => setDetail(original)}>
            <IconChevronRight className="text-black" />
          </ActionIcon>
        ),
        meta: {
          widget: 'expand',
        },
      },
    ],
  };

  const detailData = [
    {
      key: 'Classification',
      value: `Segment > Famliy > Class > ${(detail as any)?.commodityName} | ${(
        detail as any
      )?.commodityCode}`,
    },
    {
      key: 'Item Code',
      value: (detail as any)?.itemCode,
    },
    {
      key: 'Description',
      value: (detail as any)?.description,
    },
    {
      key: 'Unit of Measurement',
      value: (detail as any)?.uOMName,
    },
  ];

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
              {selector && (
                <IconChevronLeft
                  className="cursor-pointer"
                  onClick={() => setItemSelector(undefined)}
                />
              )}
              <Text className="font-bold">Item Selector</Text>
            </Group>
            {selector == 'item-master' ? (
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
            ) : null}
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
        {selector && (
          <Box>
            {mode == 'new' && (
              <NewItem
                onDone={(data) => {
                  onDone([data]);
                  close();
                }}
              />
            )}
            {!detail && mode != 'new' && (
              <>
                <Flex className="max-h-[40rem] overflow-y-hidden">
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
                    <CollectionSelector
                      config={addConfig}
                      data={list ? list.items : []}
                      total={list ? list.total : 0}
                      onDone={(data) => {
                        onDone(data);
                        close();
                      }}
                      multiSelect
                      onRequestChange={(collectionQuery) => {
                        getItemMaster(collectionQuery);
                      }}
                    />
                  </Box>
                </Flex>
              </>
            )}

            {detail && mode != 'new' && (
              <>
                <DetailTable data={detailData} />

                <Group justify="end" className="mt-2">
                  <Button
                    onClick={() => {
                      setDetail(undefined);
                    }}
                  >
                    Back
                  </Button>
                </Group>
              </>
            )}
          </Box>
        )}

        {!selector && (
          <Box>
            <Radio.Group name="itemSelector" label="Select  Item Collection">
              <Group gap="md" className="mt-2">
                <Radio label="Item Master" value="item-master" />
                <Radio label="Price Index" value="price-index" />
              </Group>
            </Radio.Group>

            <Button
              onClick={() => setItemSelector('item-master')}
              className="mt-4"
            >
              Next
            </Button>
          </Box>
        )}
      </Modal>
    </>
  );
};

export default ItemSelector;
