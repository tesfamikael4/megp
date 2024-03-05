import React, { useEffect, useState } from 'react';
import { Relation, RelationConfig, CollectionQuery } from '@megp/entity';
import {
  useLazySecondRelationQuery,
  useRelationMutation,
} from '../../mandate/_api/mandate-permission.api';

import { useParams } from 'next/navigation';

import { Permission } from '@/models/permission';
import { notify } from '@megp/core-fe';

const AddPermission = () => {
  const [currentAssigned, setCurrentAssigned] = useState<any[]>([]);
  const { id } = useParams();

  const [assignPermission, { isLoading: isSaving }] = useRelationMutation();

  const [trigger, { data: mandatePermission, isSuccess, isLoading }] =
    useLazySecondRelationQuery();

  const [permission, setPermission] = useState<Permission[]>([]);

  const relationConfig: RelationConfig<any> = {
    title: 'Permissions',
    columns: [
      {
        id: 'name',
        header: 'name',
        accessorKey: 'name',
        cell: (info) => info.getValue(),
        meta: {
          widget: 'primary',
        },
      },
    ],
    hasAdd: false,
    pagination: true,
    onSave: async (selected) => {
      const permissions = selected.map((item) => `${item.id}`);
      const data = {
        mandateId: id?.toString(),
        permission: permissions,
      };

      try {
        await assignPermission(data).unwrap();
        notify(
          'Success',
          'Permission  has been assigned to mandate successfully.',
        );
      } catch (err) {
        notify(
          'Error',
          'Sorry, an error encountered while assigning permission.',
        );
      }
    },
  };

  const onRequestChange = (request: CollectionQuery) => {
    trigger({ id: id?.toString(), collectionQuery: request });
  };

  useEffect(() => {
    if (isSuccess) {
      setCurrentAssigned(
        mandatePermission
          ? mandatePermission.items.map(
              (permission: any) => permission.permission,
            )
          : [],
      );
      setPermission(
        mandatePermission
          ? mandatePermission.items.map(
              (permission: any) => permission.permission,
            )
          : [],
      );
    }
  }, [mandatePermission, isSuccess]);

  useEffect(() => {
    setCurrentAssigned(permission);
  }, [permission]);

  return (
    <>
      <Relation
        config={relationConfig}
        data={currentAssigned ? currentAssigned : []}
        isSaving={isSaving}
        onRequestChange={onRequestChange}
        total={mandatePermission?.total ?? 0}
        isLoading={isLoading}
        readOnly={true}
        collapsed={false}
      />
    </>
  );
};

export default AddPermission;
