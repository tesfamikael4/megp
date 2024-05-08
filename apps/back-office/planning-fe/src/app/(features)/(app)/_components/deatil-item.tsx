'use client';

import { Box, LoadingOverlay } from '@mantine/core';
import { useLazyGetClassificationPathQuery } from '@/store/api/administration/administration.api';
import { useEffect } from 'react';
import { DataTable } from 'mantine-datatable';
import { logger } from '@megp/core-fe';

export const DetailItem = ({ data }: any) => {
  const [getPath, { data: classificationPath, isLoading }] =
    useLazyGetClassificationPathQuery();

  const detailData = [
    {
      key: 'Classification',
      value: `${classificationPath?.[0]?.title} > ${classificationPath?.[1]?.title} > ${classificationPath?.[2]?.title} > ${classificationPath?.[3]?.title} | ${classificationPath?.[3]?.code}`,
    },
    {
      key: 'Item Code',
      value: data.itemCode,
    },
    {
      key: 'Description',
      value: data.description,
    },
    data?.unitPrice && {
      key: 'Unit Price',
      value:
        parseFloat(data?.unitPrice)?.toLocaleString('en-US', {
          style: 'currency',
          currency: data.currency,
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
          currencyDisplay: 'code',
        }) ?? 'N/A',
    },
    {
      key: 'Unit of Measurement',
      value: data.uomName ?? data.uOMName,
    },
  ];

  useEffect(() => {
    logger.log(data);
    getPath(data.commodityCode);
  }, [data, getPath]);
  return (
    <Box className="bg-white p-4" pos="relative">
      <LoadingOverlay visible={isLoading} />
      <DataTable
        records={detailData ?? []}
        columns={[{ accessor: 'key', width: 200 }, { accessor: 'value' }]}
        withColumnBorders
        withTableBorder
        noHeader
      />
    </Box>
  );
};
