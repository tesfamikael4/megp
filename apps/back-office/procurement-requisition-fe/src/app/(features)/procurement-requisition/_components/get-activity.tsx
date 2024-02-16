import { logger } from '@megp/core-fe';
import { useLazyReadQuery } from '../_api/activity.api';
import { useEffect } from 'react';

const GetActivity = ({
  id,
  mode,
}: {
  id: string;
  mode: 'reference' | 'name';
}) => {
  const [trigger, { data }] = useLazyReadQuery();

  useEffect(() => {
    trigger(id);
  }, [id, trigger]);

  return <div>{mode === 'name' ? data?.name : data?.procurementReference}</div>;
};
export default GetActivity;
