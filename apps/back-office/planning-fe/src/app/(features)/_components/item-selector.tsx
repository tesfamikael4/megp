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
  ActionIcon,
  Checkbox,
  Group,
  Table as MantineTable,
} from '@mantine/core';
import { Relation, RelationConfig } from '@megp/entity';
// import { useListQuery } from '../_api/item-master.api';
import {
  IconBinaryTree,
  IconChevronRight,
  IconColumns,
  IconPlus,
} from '@tabler/icons-react';
import { Table, TableConfig, Tree, logger } from '@megp/core-fe';
import { useGetItemMasterQuery } from '@/store/api/administration/administration.api';

interface ItemSelectorProps {
  onDone: (item: any) => void;
  opened: boolean;
  close: () => void;
}

const ItemSelector = ({ onDone, opened, close }: ItemSelectorProps) => {
  const [mode, setMode] = useState<'tree' | 'table'>('table');
  const { data: list } = useGetItemMasterQuery({} as any);
  const [detail, setDetail] = useState(undefined);
  const [selected, setSelected] = useState<any>([]);
  const addConfig: TableConfig<any> = {
    // title: 'Items',
    columns: [
      {
        id: 'select',
        header: '',
        accessorKey: 'select',
        cell: ({ row: { original } }: any) => (
          <Checkbox
            checked={selected.includes(original)}
            onChange={(data) => {
              if (data.target.checked) setSelected([...selected, original]);
              else
                setSelected([...selected.filter((s) => s.id !== original.id)]);
            }}
          />
        ),
        meta: {
          widget: 'primary',
        },
      },
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
    // onSave: (selected) => {
    //   onDone(selected);
    //   // logger.log(selected);
    //   close();
    // },
    // searchable: true,
    // selectable: true,
    // pagination: true,
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
        size={mode == 'tree' ? '55rem' : 'lg'}
        onClose={close}
      >
        {!detail && (
          <>
            <Flex>
              {mode === 'tree' && (
                <Box className="border-t-2">
                  <Tree
                    fieldNames={{
                      key: 'id',
                      title: 'name',
                      children: 'children',
                    }}
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

              <Box
                className={mode == 'tree' ? 'border-l-2 pl-2 w-full' : 'w-full'}
              >
                <Table config={addConfig} data={list ? list.items : []} />
                {/* <Relation
                config={addConfig}
                mode="modal"
                data={list ? list.items : []}
              /> */}
              </Box>
            </Flex>

            <Group justify="end" className="mt-2">
              <Button
                onClick={() => {
                  // logger.log({ selected });
                  onDone(selected);
                  close();
                  setSelected([]);
                }}
              >
                Add
              </Button>
            </Group>
          </>
        )}

        {detail && (
          <>
            <MantineTable highlightOnHover withTableBorder withColumnBorders>
              <MantineTable.Tbody>
                <MantineTable.Tr>
                  <MantineTable.Td className="bg-slate-200 font-semibold w-1/5">
                    Classification
                  </MantineTable.Td>
                  <MantineTable.Td>
                    Segment {'>'} Famliy {'>'} Class {'>'}{' '}
                    {(detail as any)?.commodityName} |{' '}
                    {(detail as any)?.commodityCode}
                  </MantineTable.Td>
                </MantineTable.Tr>

                <MantineTable.Tr>
                  <MantineTable.Td className="bg-slate-200 font-semibold w-1/5">
                    Item Code
                  </MantineTable.Td>
                  <MantineTable.Td>{(detail as any)?.itemCode}</MantineTable.Td>
                </MantineTable.Tr>

                <MantineTable.Tr>
                  <MantineTable.Td className="bg-slate-200 font-semibold w-1/5">
                    Description
                  </MantineTable.Td>
                  <MantineTable.Td>
                    {(detail as any)?.description}
                  </MantineTable.Td>
                </MantineTable.Tr>

                <MantineTable.Tr>
                  <MantineTable.Td className="bg-slate-200 font-semibold w-1/5">
                    Unit of Measurement
                  </MantineTable.Td>
                  <MantineTable.Td>{(detail as any)?.uOMName}</MantineTable.Td>
                </MantineTable.Tr>
              </MantineTable.Tbody>
            </MantineTable>

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
      </Modal>
    </>
  );
};

export default ItemSelector;
