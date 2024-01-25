'use client';

import { Box, LoadingOverlay, Table } from '@mantine/core';
import { DetailTable } from './detail-table';
import { useLazyGetClassificationPathQuery } from '@/store/api/administration/administration.api';
import { useEffect } from 'react';

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
    {
      key: 'Unit Price',
      value:
        data?.unitPrice?.toLocaleString('en-US', {
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
    getPath(data.commodityCode);
  }, [data, getPath]);
  return (
    <Box className="bg-white p-4" pos="relative">
      <LoadingOverlay visible={isLoading} />
      <DetailTable data={detailData} />
    </Box>
  );
};
