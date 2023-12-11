import React, { useEffect, useState } from 'react';
import {
  Box,
  Modal,
  Tooltip,
  Flex,
  Text,
  Button,
  ActionIcon,
  Checkbox,
  Group,
  Table as MantineTable,
} from '@mantine/core';
import {
  IconBinaryTree,
  IconChevronRight,
  IconColumns,
  IconPlus,
} from '@tabler/icons-react';
import { Table, TableConfig, Tree, logger } from '@megp/core-fe';
import {
  useGetClassificationsQuery,
  useGetItemMasterQuery,
} from '@/store/api/administration/administration.api';

interface ItemSelectorProps {
  onDone: (item: any) => void;
  opened: boolean;
  close: () => void;
}

const ItemSelector = ({ onDone, opened, close }: ItemSelectorProps) => {
  const [mode, setMode] = useState<'tree' | 'table'>('table');
  const { data: list } = useGetItemMasterQuery({} as any);
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
  };

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
            <Text className="font-bold">Item Selector</Text>
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
                  // onClick={changeMode}
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
        {!detail && (
          <>
            <Flex className="h-[30rem] overflow-y-hidden">
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
                className={mode == 'tree' ? 'border-l-2 pl-2 w-3/5' : 'w-full'}
              >
                <Table config={addConfig} data={list ? list.items : []} />
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
