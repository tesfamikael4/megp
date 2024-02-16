import { useLazyListByIdQuery } from '@/app/(features)/procurement-requisition/_api/requisitioner.api';
import { Table, TableConfig } from '@megp/core-fe';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';

const config: TableConfig<any> = {
  columns: [
    {
      id: 'name',
      header: 'Name',
      accessorKey: 'name',
    },
  ],
};

export const Requisitioner = ({ activityId }: { activityId: string }) => {
  const [getRequisitioner, { data }] = useLazyListByIdQuery();

  const { id } = useParams();

  useEffect(() => {
    getRequisitioner({ id: id?.toString(), collectionQuery: undefined });
  }, [getRequisitioner]);

  return <Table data={data?.items ?? []} config={config} />;
};
