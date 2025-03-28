import React, { useEffect } from 'react';
import { useLazyListByIdQuery } from '../_api/mechanization.api';
import { DetailTable } from './detail-table';
import { LoadingOverlay } from '@mantine/core';
import { useLazyReadQuery } from '../_api/rfx/rfx.api';

export default function ProcurmentMechanism({
  id,
  mode,
}: {
  id: string;
  mode?: string;
}) {
  const [getMechanism, { data: mechanism, isLoading: isGetMechanismLoading }] =
    useLazyListByIdQuery();
  const [getRfq, { data: rfq, isLoading: isGettingDetail }] =
    useLazyReadQuery();

  const config = [
    {
      key: 'Procurement Type',
      value:
        mode != 'rfq'
          ? mechanism?.items[0]?.procurementType
          : rfq?.rfxProcurementMechanism?.PRProcurementMechanisms
              .procurementType,
    },
    {
      key: 'Procurement Method',
      value:
        mode != 'rfq'
          ? mechanism?.items[0]?.procurementMethod
          : rfq?.rfxProcurementMechanism?.PRProcurementMechanisms
              ?.procurementMethod,
    },
    {
      key: 'Funding Source',
      value:
        mode != 'rfq'
          ? mechanism?.items[0]?.fundingSource
          : rfq?.rfxProcurementMechanism?.PRProcurementMechanisms
              ?.fundingSource,
    },
    {
      key: 'Procurement Process',
      value: (
        mode != 'rfq'
          ? mechanism?.items[0]?.isOnline
          : rfq?.rfxProcurementMechanism?.PRProcurementMechanisms?.isOnline
      )
        ? 'Online'
        : 'Offline',
    },
    {
      key: 'Supplier Target Group',
      value:
        mode != 'rfq'
          ? mechanism?.items[0]?.targetGroup.join(', ')
          : rfq?.rfxProcurementMechanism?.PRProcurementMechanisms.targetGroup.join(
              ', ',
            ),
    },
  ];

  useEffect(() => {
    mode != 'rfq' &&
      getMechanism({
        id,
        collectionQuery: {},
      });
    mode == 'rfq' && getRfq(id.toString());
  }, [id]);

  return (
    <>
      <LoadingOverlay visible={isGetMechanismLoading || isGettingDetail} />
      <DetailTable data={config} />
    </>
  );
}
