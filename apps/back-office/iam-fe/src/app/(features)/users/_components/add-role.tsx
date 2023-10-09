import React, { useEffect, useState } from 'react';
import { Modal } from '@mantine/core';
import { Relation, RelationConfig } from '@megp/entity';
import { Mandate } from '@/models/mandate';
import { notifications } from '@mantine/notifications';
import { logger } from '@megp/core-fe';
import {
  useAssignRoleToUserMutation,
  useGetRoleByUserIdQuery,
} from '../_api/userAssignment.api';
import { useParams } from 'next/navigation';
import { useListQuery } from '../../roles/_api/role.api';
import { Role } from '@/models/role';

const AddEntityModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAssignedRoles, setCurrentAssignedRoles] = useState<Role[]>([]);
  const { id } = useParams();

  const [assignRole, { isLoading: isSaving, isSuccess: assigned }] =
    useAssignRoleToUserMutation();

  const {
    data: userRole,
    isSuccess: success,
    isLoading,
  } = useGetRoleByUserIdQuery(id?.toString());
  const { data: roles, isSuccess } = useListQuery();
  logger.log(currentAssignedRoles);

  const relationConfig: RelationConfig<Mandate> = {
    title: 'Roles',
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
      {
        id: 'description',
        header: 'Description',
        accessorKey: 'description',
        cell: (info) => info.getValue(),
        meta: {
          widget: 'multiline',
        },
      },
    ],
    onSave: async () => {
      const data = currentAssignedRoles.map((item) => {
        return {
          userId: id?.toString(),
          roleId: item?.id,
          roleName: item?.name,
        };
      });

      try {
        id && (await assignRole({ data, id: id?.toString() }).unwrap());

        notifications.show({
          message: 'role has been assigned to user successfully.',
          title: 'Success',
        });
      } catch (err) {
        notifications.show({
          message: 'Sorry, an error encountered while assigning role.',
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
    title: 'Roles',
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
    onSave: (selected) => {
      setCurrentAssignedRoles(selected);
      setIsModalOpen(false);
    },

    selectable: true,
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (success) {
      const data = userRole?.userRoles.map((role: any) => role?.role);
      setCurrentAssignedRoles(data);
    }
  }, [assigned, isSuccess, success, userRole?.userRoles]);

  return (
    <>
      <Relation
        config={relationConfig}
        data={currentAssignedRoles}
        isSaving={isSaving}
        isLoading={isLoading}
      />
      <Modal title="Roles" opened={isModalOpen} onClose={handleCloseModal}>
        <Relation
          config={addConfig}
          data={roles ? roles.items : []}
          mode="modal"
          currentSelected={currentAssignedRoles}
        />
      </Modal>
    </>
  );
};

export default AddEntityModal;
