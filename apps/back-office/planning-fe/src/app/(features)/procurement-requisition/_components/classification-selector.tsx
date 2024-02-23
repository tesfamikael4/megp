import React, { useEffect, useState } from 'react';
import { Box, Modal, TextInput, Tooltip, Flex, Text } from '@mantine/core';
import { Relation, RelationConfig } from '@megp/entity';
import { useDisclosure } from '@mantine/hooks';
import { IconBinaryTree, IconColumns } from '@tabler/icons-react';
import { Tree, logger } from '@megp/core-fe';
import { useLazyGetClassificationsQuery } from '@/store/api/administration/administration.api';
import { CollectionSelector } from './collection-selector';

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
  const [getCommodity, { data: list }] = useLazyGetClassificationsQuery();
  const addConfig: RelationConfig<any> = {
    title: 'Classifications',
    columns: [
      {
        id: 'name',
        header: 'Classifications',
        accessorKey: 'title',
        meta: {
          widget: 'expand',
        },
        cell: ({ row: { original } }: any) => (
          <>
            {original.title} ({original.code})
          </>
        ),
      },
    ],
    onSave: (selected) => {
      logger.log(selected[0]);
      onDone(selected[0]);
      close();
    },
    searchable: true,
    disableMultiSelect: true,
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
          <CollectionSelector
            config={addConfig}
            data={list ? list.items : []}
            total={list ? list.total : 0}
            onDone={(data) => {
              onDone(data);
              logger.log(data);
              close();
            }}
            onRequestChange={(collectionQuery) => {
              const req = {
                ...collectionQuery,
                where: [
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
        ) : (
          <Tree
            fieldNames={{ title: 'title', key: 'code' }}
            data={list ? list.items : []}
            mode="select"
            disableModal
            disableParentSelect
            url={(code) =>
              `${
                process.env.NEXT_PUBLIC_ADMINISTRATION_API ??
                '/administration/api/'
              }classifications?q=w%3DparentCode%3A%3D%3A${code}`
            }
            selectedKeys={selectedData}
            onDone={(item) => {
              onDone(item);

              close();
            }}
          />
        )}
      </Modal>
    </>
  );
};

export default ClassificationSelector;
