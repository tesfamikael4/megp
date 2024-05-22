import { Box, Stack } from '@mantine/core';
import { ExpandableTable, Table, logger } from '@megp/core-fe';
import React from 'react';
import { DetailTable } from '../detail-table';

export default function InvitationDetail({ products }: { products: any }) {
  const specificationDetails = Object.entries(
    products?.catalogueSpecificationValues || {},
  )
    .filter(([key]) => key !== 'url')
    .map(([key, value]) => ({
      key: `${key.charAt(0).toUpperCase() + key.slice(1)}`,
      value: value ?? '',
    }));

  return (
    <Stack className="p-4">
      <DetailTable data={specificationDetails as any} />
    </Stack>
  );
}
