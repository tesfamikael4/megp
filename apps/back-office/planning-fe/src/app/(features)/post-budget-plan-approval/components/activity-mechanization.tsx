import { useEffect, useState } from 'react';
import { useLazyListByIdQuery } from '../../_api/pre-mechanism';
import { DetailTable } from '../../_components/detail-table';

export const ActivityMechanization = ({
  activityId,
}: {
  activityId: string;
}) => {
  const [getMechanism, { data: list, isSuccess }] = useLazyListByIdQuery();
  const [mechanism, setMechanism] = useState<any>([]);

  useEffect(() => {
    getMechanism({ id: activityId, collectionQuery: undefined });
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
