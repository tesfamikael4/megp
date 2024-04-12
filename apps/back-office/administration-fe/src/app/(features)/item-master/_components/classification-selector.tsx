import {
  useListQuery,
  useLazyListQuery,
} from '../../taxonomy/_api/taxonomy.api';

import {
  Box,
  Button,
  Divider,
  Flex,
  Group,
  Modal,
  Text,
  TextInput,
  Tooltip,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  ExpandableTable,
  MantineTree,
  TreeConfig,
  notify,
} from '@megp/core-fe';
import { IconBinaryTree, IconColumns } from '@tabler/icons-react';
import { useEffect, useState } from 'react';

interface ClassificationSelectorProps {
  selectedData: any;
  onDone: (item) => void;
  error: string | null;
}

const ClassificationSelector = ({
  selectedData,
  onDone,
  error,
}: ClassificationSelectorProps) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [mode, setMode] = useState<'tree' | 'table'>('table');
  const [getCommodity, { data: list, isLoading: isGetCommodityLoading }] =
    useLazyListQuery();
  const { data: classifications } = useListQuery({
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

  const [selectedClassification, setSelectedClassification] = useState<any>([]);

  const treeConfig: TreeConfig<any> = {
    id: 'code',
    label: 'title',
    selectable: true,
    multipleSelect: true,
    selectOnlyLeafs: true,
    selectedIds: selectedClassification,
    setSelectedIds: setSelectedClassification,
    load: async (data) => {
      const res = await getCommodity({
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
        result:
          res?.items?.map((c) => ({
            code: c.code,
            title: c.title,
          })) ?? [],
        loading: isGetCommodityLoading,
      };
    },
  };

  const tableConfig = {
    isSearchable: true,
    primaryColumn: 'title',
    columns: [
      {
        accessor: 'title',
        title: 'Classifications',
        render: (record) => (
          <>
            {record.title} ({record.code})
          </>
        ),
      },
    ],
    selectedItems: selectedClassification,
    disableMultiSelect: true,
    setSelectedItems: setSelectedClassification,
    isSelectable: true,
  };

  const changeMode = () => {
    mode === 'table' ? setMode('tree') : setMode('table');
  };

  useEffect(() => {
    setMode('table');
  }, [opened]);

  return (
    <>
      <TextInput
        readOnly
        onClick={open}
        label="Classification"
        value={selectedData?.name}
        error={error}
        withAsterisk
      />
      <Modal
        title={
          <Flex justify="space-between" className="w-full">
            <Text>Classification Assignment</Text>
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
        onClose={close}
        size="lg"
      >
        {mode == 'table' ? (
          <>
            <ExpandableTable
              config={tableConfig}
              data={list ? list.items : []}
              total={list ? list.total : 0}
              onRequestChange={(collectionQuery) => {
                const req = {
                  ...collectionQuery,
                  where: [
                    ...collectionQuery.where,
                    [
                      {
                        column: 'type',
                        value: 'COMMODITY',
                        operator: '=',
                      },
                    ],
                  ],
                };
                getCommodity(req);
              }}
            />
          </>
        ) : (
          <>
            <Box className="overflow-y-auto h-[30rem]">
              <MantineTree
                config={treeConfig}
                data={
                  classifications
                    ? classifications.items.map((c) => ({
                        code: c.code,
                        title: c.title,
                      }))
                    : []
                }
              />
            </Box>
          </>
        )}
        <Divider h={5} />
        <Group justify="end">
          <Button
            onClick={() => {
              if (selectedClassification.length === 0) {
                // If no data is selected, set an error message
                notify('Error', 'Please select a classification.');
              } else {
                onDone(
                  selectedClassification[selectedClassification.length - 1],
                );
                close();
              }
            }}
          >
            Done
          </Button>
        </Group>
      </Modal>
    </>
  );
};

export default ClassificationSelector;
