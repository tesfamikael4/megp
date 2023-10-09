import React, { useEffect, useState } from 'react';
import { Modal, Stack } from '@mantine/core';
import { Relation, RelationConfig } from '@megp/entity';
import { Mandate } from '@/models/mandate';
import { notifications } from '@mantine/notifications';
import {
  useAssignPermisionToRoleMutation,
  useGetPermissionByOrganizationIdQuery,
  useGetRolePermissionsQuery,
} from '../_api/others.api';
import { useParams } from 'next/navigation';
import { logger } from '@megp/core-fe';

const AddUserModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAssigned, setCurrentAssigned] = useState<any[]>([]);
  const { id } = useParams();

  const [assignPermission, { isLoading: isSaving }] =
    useAssignPermisionToRoleMutation();

  const {
    data: rolePermision,
    isSuccess: userSucced,
    isLoading,
  } = useGetRolePermissionsQuery(id?.toString());
  const { data: roles } = useGetPermissionByOrganizationIdQuery(
    '099454a9-bf8f-45f5-9a4f-6e9034230250',
  );

  const relationConfig: RelationConfig<any> = {
    title: 'Permission',
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
    onSave: async () => {
      const data = currentAssigned.map((permission) => {
        return {
          roleId: id,
          permissionId: permission?.id,
          permissionName: permission?.name,
          permissionKey: permission?.key,
          applicationKey: permission?.applicationKey,
          applicationName: permission?.applicationName,
          applicationId: permission?.applicationId,
          organizationId: '099454a9-bf8f-45f5-9a4f-6e9034230250',
        };
      });
      try {
        await assignPermission({ data, idParse: id?.toString() }).unwrap();

        notifications.show({
          message: 'user has been assigned to unit successfully.',
          title: 'Success',
          color: 'green',
        });
      } catch (err) {
        notifications.show({
          message: 'Sorry, an error encountered while assigning user.',
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
      logger.log(selected);
      setCurrentAssigned(selected);

      setIsModalOpen(false);
    },

    selectable: true,
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (userSucced) {
      setCurrentAssigned(rolePermision?.rolePermissions);
    }
  }, [userSucced, rolePermision]);

  return (
    <>
      <Relation
        config={relationConfig}
        data={currentAssigned}
        isSaving={isSaving}
        isLoading={isLoading}
      />
      <Modal title="Permission" opened={isModalOpen} onClose={handleCloseModal}>
        <Relation
          mode="modal"
          config={addConfig}
          data={roles ? roles.items : []}
          currentSelected={currentAssigned}
        />
      </Modal>
    </>
  );
};

export default AddUserModal;
