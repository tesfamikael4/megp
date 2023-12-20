import React, { useEffect, useState } from 'react';
import { Relation, RelationConfig } from '@megp/entity';
import { useLazySecondRelationQuery } from '../_api/role-permission.api';
import { useParams } from 'next/navigation';

const ViewPermissionModal = () => {
  const [currentAssigned, setCurrentAssigned] = useState<any[]>([]);
  const { id } = useParams();

  const [trigger, { data: rolePermision, isSuccess, isLoading }] =
    useLazySecondRelationQuery();

  const relationConfig: RelationConfig<any> = {
    title: 'Permissions',
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

    hasAdd: false,
  };

  useEffect(() => {
    trigger({
      id: id?.toString(),
      collectionQuery: undefined,
    });
  }, [id, trigger]);

  useEffect(() => {
    if (isSuccess) {
      setCurrentAssigned(
        rolePermision
          ? rolePermision.items.map((permission: any) => permission.permission)
          : [],
      );
    }
  }, [rolePermision, isSuccess]);

  return (
    <>
      <Relation
        config={relationConfig}
        data={currentAssigned ? currentAssigned : []}
        isLoading={isLoading}
        readOnly={true}
        collapsed={false}
      />
    </>
  );
};

export default ViewPermissionModal;
