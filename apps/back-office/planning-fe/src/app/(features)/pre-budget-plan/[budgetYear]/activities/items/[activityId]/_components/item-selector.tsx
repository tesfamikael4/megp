import React, { useEffect, useState } from 'react';
import {
  Box,
  Modal,
  TextInput,
  Tooltip,
  Flex,
  Text,
  Center,
  Button,
} from '@mantine/core';
import { Relation, RelationConfig } from '@megp/entity';
// import { useListQuery } from '../_api/item-master.api';
import { IconBinaryTree, IconColumns, IconPlus } from '@tabler/icons-react';
import { Tree, logger } from '@megp/core-fe';
import { useGetItemMasterQuery } from '@/store/api/administration/administration.api';

interface ItemSelectorProps {
  onDone: (item: any) => void;
  opened: boolean;
  close: () => void;
}

const ItemSelector = ({ onDone, opened, close }: ItemSelectorProps) => {
  const [mode, setMode] = useState<'tree' | 'table'>('table');
  const { data: list } = useGetItemMasterQuery({} as any);
  const addConfig: RelationConfig<any> = {
    title: 'Items',
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
        id: 'commodityName',
        header: 'Classification',
        accessorKey: 'commodityName',
        cell: ({ raw: { original } }: any) => (
          <>
            {original.commodityName} ({original.commodityCode})
          </>
        ),
        meta: {
          widget: 'expand',
        },
      },
    ],
    onSave: (selected) => {
      onDone(selected);
      // logger.log(selected);
      close();
    },
    searchable: true,
    selectable: true,
    pagination: true,
  };

  const changeMode = () => {
    mode === 'table' ? setMode('tree') : setMode('table');
  };

  useEffect(() => {
    setMode('table');
  }, [opened]);

  return (
    <>
      {/* <Center>
        <Button variant="outline" onClick={open}>
          <IconPlus size={17} /> Add Items
        </Button>
      </Center> */}
      <Modal
        title={
          <Flex justify="space-between" className="w-full">
            <Text className="font-bold">Item Selector</Text>
            <Tooltip label={mode == 'table' ? 'Tree View' : 'Grid View'}>
              <Box
                className="text-slate-600 cursor-pointer"
                onClick={changeMode}
              >
                {mode == 'table' ? <IconBinaryTree /> : <IconColumns />}
              </Box>
            </Tooltip>
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
        size={mode == 'tree' ? 'xl' : 'lg'}
        onClose={close}
      >
        <Flex>
          {mode === 'tree' && (
            <Box className="border-t-2">
              <Tree
                fieldNames={{ key: 'id', title: 'name', children: 'children' }}
                data={[
                  {
                    id: '001',
                    name: 'test 123',
                    children: [{ id: '003', name: 'test 2' }],
                  },
                  {
                    id: '002',
                    name: 'test 123',
                    children: [{ id: '004', name: 'test 2' }],
                  },
                ]}
                mode="view"
                disableModal
                disableParentSelect
                onDone={(item) => {
                  // logger.log(item);
                  close();
                }}
              />
            </Box>
          )}

          <Box className={mode == 'tree' ? 'border-l-2 pl-2 w-full' : 'w-full'}>
            <Relation
              config={addConfig}
              mode="modal"
              data={list ? list.items : []}
            />
          </Box>
        </Flex>
      </Modal>
    </>
  );
};

export default ItemSelector;
