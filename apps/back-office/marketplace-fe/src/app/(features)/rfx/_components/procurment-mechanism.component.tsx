import React, { useEffect } from 'react';
import { useLazyListByIdQuery } from '../_api/mechanization.api';
import { DetailTable } from './detail-table';
import { LoadingOverlay } from '@mantine/core';

export default function ProcurmentMechanism({ id }: { id: string }) {
  const [getMechanism, { data: mechanism, isLoading: isGetMechanismLoading }] =
    useLazyListByIdQuery();

  const config = [
    {
      key: 'Procurement Type',
      value: mechanism?.items[0]?.procurementType,
    },
    {
      key: 'Procurement Method',
      value: mechanism?.items[0]?.procurementMethod,
    },
    {
      key: 'Funding Source',
      value: mechanism?.items[0]?.fundingSource,
    },
    {
      key: 'Procurement Process',
      value: mechanism?.items[0]?.isOnline ? 'Online' : 'Offline',
    },
    {
      key: 'Supplier Target Group',
      value: mechanism?.items[0]?.targetGroup.join(', '),
    },
  ];

  useEffect(() => {
    getMechanism({
      id,
      collectionQuery: {},
    });
  }, [id]);

  return (
    <>
      <LoadingOverlay visible={isGetMechanismLoading} />
      <DetailTable data={config} />
    </>
  );
}
