import React from 'react';

import { Relation, RelationConfig } from '@megp/entity';
import { useListByAppIdQuery } from '../_api/permission.api';
import { useParams } from 'next/navigation';
import { Permission } from '@/models/permission';

const AddPermisionModal = () => {
  const { id } = useParams();

  const { data: applicationPermission, isSuccess } = useListByAppIdQuery(
    id?.toString(),
  );

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

  return (
    <>
      <Relation
        config={relationConfig}
        data={isSuccess ? applicationPermission.items : []}
        total={applicationPermission?.items.length}
        readOnly={true}
        collapsed={false}
      />
    </>
  );
};

export default AddPermisionModal;
