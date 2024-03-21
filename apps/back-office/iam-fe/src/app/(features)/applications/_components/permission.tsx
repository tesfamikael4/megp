import React, { useEffect } from 'react';

import { CollectionQuery, Relation, RelationConfig } from '@megp/entity';
import { useLazyListByIdQuery } from '../_api/permission.api';
import { useParams } from 'next/navigation';
import { Permission } from '@/models/permission';

const AddPermisionModal = () => {
  const { id } = useParams();

  const [trigger, { data: applicationPermission }] = useLazyListByIdQuery();
  const relationConfig: RelationConfig<Permission> = {
    title: 'Application Permission',
    hasAdd: false,
    columns: [
      {
        id: 'name',
        header: 'Name',
        accessorKey: 'name',
        cell: (info) => info.getValue(),
        meta: {
          widget: 'primary',
        },
      },
    ],
    pagination: true,
  };

  const onRequestChange = (request: CollectionQuery) => {
    trigger({
      id: id?.toString(),
      collectionQuery: request,
    });
  };

  return (
    <>
      <Relation
        config={relationConfig}
        data={applicationPermission?.items ?? []}
        total={applicationPermission?.total ?? 0}
        readOnly={true}
        onRequestChange={onRequestChange}
        collapsed={false}
      />
    </>
  );
};

export default AddPermisionModal;
