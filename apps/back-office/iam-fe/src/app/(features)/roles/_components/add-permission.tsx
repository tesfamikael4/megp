import React, { useEffect, useState } from 'react';
import { Modal } from '@mantine/core';
import { Relation, RelationConfig } from '@megp/entity';
import { Mandate } from '@/models/mandate';
import { notifications } from '@mantine/notifications';
import {
  useLazySecondRelationQuery,
  useRelationMutation,
} from '../_api/role-permission.api';
import { useGetPermissionByOrganizationIdQuery } from '../_api/others.api';
import { useParams } from 'next/navigation';

const AddUserModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [currentAssigned, setCurrentAssigned] = useState<any[]>([]);
  const { id } = useParams();

  const [assignPermission, { isLoading: isSaving }] = useRelationMutation();

  const [trigger, { data: rolePermision, isSuccess, isLoading }] =
    useLazySecondRelationQuery();

  const { data: permission } = useGetPermissionByOrganizationIdQuery(
    '099454a9-bf8f-45f5-9a4f-6e9034230250',
  );

  const relationConfig: RelationConfig<any> = {
    title: 'Permission Assignment',
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
    onSave: async (selected) => {
      const permissions = selected.map((item) => `${item.id}`);
      const data = {
        roleId: id?.toString(),
        permission: permissions,
      };

      try {
        await assignPermission(data).unwrap();

        notifications.show({
          message: 'Permission has been assigned to role successfully.',
          title: 'Success',
          color: 'green',
        });
      } catch (err) {
        notifications.show({
          message: 'Sorry, an error encountered while assigning permission.',
          title: 'Error',
          color: 'red',
        });
      }
    },
    onAdd: () => {
      setIsModalOpen(true);
    },
  };
  const addConfig: RelationConfig<Mandate> = {
    title: 'permission',
    columns: [
      {
        id: 'name',
        header: 'PermisionName',
        accessorKey: 'name',
        cell: (info) => info.getValue(),
        meta: {
          widget: 'primary',
        },
      },
    ],
    onSave: (selected) => {
      setCurrentAssigned(selected);

      setIsModalOpen(false);
    },

    selectable: true,
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    trigger(id?.toString());
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
        isSaving={isSaving}
        isLoading={isLoading}
      />
      <Modal title="Permission" opened={isModalOpen} onClose={handleCloseModal}>
        <Relation
          mode="modal"
          config={addConfig}
          data={permission ? permission.items : []}
          currentSelected={currentAssigned}
        />
      </Modal>
    </>
  );
};

export default AddUserModal;
