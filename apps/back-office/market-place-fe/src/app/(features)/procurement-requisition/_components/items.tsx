'use client';

import { Box, LoadingOverlay, Text } from '@mantine/core';
import { ExpandableTable, Section, logger } from '@megp/core-fe';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useLazyGetPrItemsQuery } from '@/store/api/pr/pr.api';
import { ItemDetailForm } from './item-form-detail';
import { CollectionQuery } from '@megp/entity';

export function Items({ activityId }: { activityId?: string }) {
  const [listById, { data: itemsList, isLoading }] = useLazyGetPrItemsQuery();

  const { id } = useParams();
  const router = useRouter();

  const config = {
    isExpandable: true,
    columns: [
      { accessor: 'description', title: 'Description' },
      {
        title: 'UoM',
        accessor: 'uom',
        width: 200,
      },
      {
        accessor: 'quantity',
        width: 100,
      },
      {
        title: 'Unit Price',
        textAlign: 'center',
        accessor: 'unitPrice',
        width: 100,
        render: (record) => {
          return (
            <p>
              {parseInt(record?.unitPrice)?.toLocaleString('en-US', {
                style: 'currency',
                currency: record?.currency ? record?.currency : 'USD',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
                currencyDisplay: 'code',
              })}
            </p>
          );
        },
      },

      {
        title: 'Total',
        accessor: 'total',
        textAlign: 'right',
        width: 150,
        render: (record) => (
          <p className="text-right">
            {(record.unitPrice * record.quantity).toLocaleString('en-US', {
              style: 'currency',
              currency: record?.currency ? record?.currency : 'USD',
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
              currencyDisplay: 'code',
            })}
          </p>
        ),
      },
    ],
  };

  const handleOnSearch = (data, id) => {
    logger.log('search clicked');
    router.push(`${id}/filter/sdfsd`);
  };

  const listConfig = {
    ...config,
    isLoading: isLoading,

    expandedRowContent: (record) => (
      <ItemDetailForm item={record} onSave={handleOnSearch} isLoading={false} />
    ),
    columns: [...config.columns],
  };

  const onRequestChange = (request: CollectionQuery) => {
    listById({ id: id as string, collectionQuery: request });
  };

  return (
    <Section title="Items" collapsible={false}>
      <Box className="mt-2">
        {itemsList?.items?.length != 0 && (
          <Box pos={'relative'}>
            <LoadingOverlay visible={isLoading} />
            {!activityId && (
              <Text className="text-lg" fw="500">
                Items List
              </Text>
            )}

            <ExpandableTable
              config={listConfig}
              data={itemsList?.items ?? []}
              total={itemsList?.total}
              onRequestChange={onRequestChange}
            />
          </Box>
        )}
      </Box>
    </Section>
  );
}
