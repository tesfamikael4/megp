import React, { useEffect, useState } from 'react';
import { Box, Flex, Button, Group, LoadingOverlay } from '@mantine/core';
import { useLazyListQuery } from '@/app/(features)/organizations/_api/organizations.api';
import { ExpandableTable } from '@megp/core-fe';
import { CollectionQuery } from '@megp/entity';

interface CatalogProps {
  setSelectedOrg: (item: any) => void;
  opened: boolean;
  close: () => void;
  selectedOrg: any;
  mode?: 'assign' | undefined;
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
  const [selectedItems, setSelectedItems] = useState<any[]>([]);

  useEffect(() => {
    setSelectedItems(selectedOrg);
  }, []);

  //variables
  const config = {
    isSearchable: true,
    disableMultiSelect: mode === 'assign' ? false : true,
    primaryColumn: 'name',
    columns: [{ accessor: 'name' }, { accessor: 'description' }],
    isExpandable: true,
    selectedItems: selectedItems,
    setSelectedItems: setSelectedItems,
    isSelectable: true,
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

  return (
    <>
      <Box pos={'relative'}>
        <LoadingOverlay visible={isLoading} />
        <>
          <Flex className="max-h-[30rem]">
            <Box className={'w-full'}>
              <ExpandableTable
                config={config}
                data={list ? list?.items : []}
                total={list ? list.total : 0}
                onRequestChange={
                  mode == 'assign' ? onRequestChangeAssign : onRequestChange
                }
              />
            </Box>
          </Flex>
          <Group justify="end" mt={40}>
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
