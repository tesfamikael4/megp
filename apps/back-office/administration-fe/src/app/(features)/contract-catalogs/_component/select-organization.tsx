import React, { useEffect, useState } from 'react';
import { Box, Flex, Button, Group, LoadingOverlay } from '@mantine/core';
import { useLazyListQuery } from '@/app/(features)/organizations/_api/organizations.api';
import { ExpandableTable } from '@megp/core-fe';
import { CollectionQuery } from '@megp/entity';
import { useLazyListByIdQuery } from '../_api/contract-item.api';
import { useParams } from 'next/navigation';
import RenderDescription from './render-item-description';

interface CatalogProps {
  setSelectedOrg: (item: any) => void;
  opened: boolean;
  close: () => void;
  selectedOrg: any;
  mode?: 'assign' | 'item' | undefined;
}

const SelectOrganization = ({
  setSelectedOrg,
  opened,
  close,
  selectedOrg,
  mode,
}: CatalogProps) => {
  //rtk queries
  const [getOrganization, { data: list, isLoading }] = useLazyListQuery();
  const [getItem, { data: listItem, isLoading: itemLoading }] =
    useLazyListByIdQuery();

  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const { id } = useParams();

  useEffect(() => {
    setSelectedItems(selectedOrg);
  }, []);

  //variables
  const config = {
    isSearchable: true,
    disableMultiSelect: mode === 'assign' ? false : true,
    primaryColumn: 'name',

    isExpandable: true,
    selectedItems: selectedItems,
    setSelectedItems: setSelectedItems,
    isSelectable: true,
  };
  const configItem = {
    ...config,
    columns: [
      {
        accessor: 'description',
        render: (record) => <RenderDescription record={record} />,
      },
      { accessor: 'maximumQuantity' },
      { accessor: 'utilizedQuantity' },
    ],
    isLoading: itemLoading ?? isLoading,
  };
  const orgConfig = {
    ...config,
    columns: [{ accessor: 'name' }, { accessor: 'description' }],
  };

  const onRequestChange = (request: CollectionQuery) => {
    request?.where?.push([
      {
        column: 'type',
        value: 'BACK-OFFICE',
        operator: '!=',
      },
    ]);

    getOrganization(request);
  };
  const onRequestChangeAssign = (request: CollectionQuery) => {
    request?.where?.push([
      {
        column: 'type',
        value: 'BACK-OFFICE',
        operator: '=',
      },
    ]);

    getOrganization(request);
  };

  const onRequestChangeItem = (request: CollectionQuery) => {
    getItem({ id: id?.toString(), collectionQuery: request });
  };

  return (
    <>
      <Box pos={'relative'}>
        <LoadingOverlay visible={isLoading} />
        <>
          <Flex>
            <Box className={'w-full'}>
              <ExpandableTable
                config={mode == 'item' ? configItem : orgConfig}
                data={
                  mode == 'item' ? listItem?.items ?? [] : list?.items ?? []
                }
                total={list ? list.total : 0}
                onRequestChange={
                  mode == 'assign'
                    ? onRequestChangeAssign
                    : mode === 'item'
                      ? onRequestChangeItem
                      : onRequestChange
                }
              />
            </Box>
          </Flex>

          <Group justify="end" mt={10}>
            <Button
              onClick={() => {
                setSelectedOrg(selectedItems);
                close();
              }}
            >
              Done
            </Button>
          </Group>
        </>
      </Box>
    </>
  );
};

export default SelectOrganization;
