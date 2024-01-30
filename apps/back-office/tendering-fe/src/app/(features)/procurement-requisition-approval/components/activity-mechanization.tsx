import { useEffect, useState } from 'react';
import { useLazyListByIdQuery } from '@/app/(features)/_api/mechanization.api';
import { DetailTable } from '../../_components/detail-table';

export const ActivityMechanization = ({ prId }: { prId: string }) => {
  const [getMechanism, { data: list, isSuccess }] = useLazyListByIdQuery();
  const [mechanism, setMechanism] = useState<any>([]);

  useEffect(() => {
    getMechanism({ id: prId, collectionQuery: undefined });
  }, []);

  useEffect(() => {
    if (list && list.total != 0 && isSuccess) {
      const temp = list.items[0];
      setMechanism([
        {
          key: 'Procurement Method',
          value: temp.procurementMethod,
        },
        {
          key: 'Procurement Type',
          value: temp.procurementType,
        },
        {
          key: 'Funding Source',
          value: temp.fundingSource,
        },
        {
          key: 'Procurement Process',
          value: temp.isOnline ? 'Online' : 'Offline',
        },
        {
          key: 'Supplier Target Group',
          value: temp.targetGroup.join(', '),
        },
      ]);
    }
  }, [isSuccess, list]);
  return <DetailTable data={mechanism} />;
};
