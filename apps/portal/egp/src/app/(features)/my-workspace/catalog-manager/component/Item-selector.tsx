'use client';

import { Button, Group, Box, LoadingOverlay } from '@mantine/core';
import { ExpandableTable, ExpandableTableConfig, logger } from '@megp/core-fe';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useLazyGetItemsQuery } from '@/store/api/item-master/item-master.api';

export const ItemSelector = ({ close }: any) => {
  const [itemSelected, setItemSelected] = useState<any[]>([]);

  const [getItems, { data: list, isLoading }] = useLazyGetItemsQuery({});
  const { id } = useParams();
  const route = useRouter();

  const config: ExpandableTableConfig = {
    disableMultiSelect: true,
    selectedItems: itemSelected,
    setSelectedItems: (data) => {
      const temp = data.filter((d) => !itemSelected.includes(d));
      setItemSelected(temp);
    },
    isExpandable: true,

    columns: [
      {
        title: 'Description',
        accessor: 'description',
      },
      {
        title: 'Unit of Measurement',
        accessor: 'uOMName',
      },
      {
        title: 'Classification',
        accessor: 'commodityName',
      },
      {
        title: 'Item Catagory',
        accessor: 'itemSubcategoryName',
      },
    ],
  };

  const onRequestChange = (collectionQuery) => {
    getItems(collectionQuery);
  };

  const handleSave = (id) => {
    route.push(`catalog-manager/${id}/new`);
    close();
  };
  return (
    <Box pos="relative">
      <LoadingOverlay visible={isLoading} />

      <>
        <ExpandableTable
          data={list?.items ?? []}
          config={config}
          total={list?.total ?? 0}
          onRequestChange={onRequestChange}
        />
        <Group justify="end">
          <Button onClick={() => handleSave(itemSelected[0]?.id)}>Done</Button>
        </Group>
      </>
    </Box>
  );
};
