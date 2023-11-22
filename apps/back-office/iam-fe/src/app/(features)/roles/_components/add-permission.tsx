import React, { useEffect, useState } from 'react';
import { Modal } from '@mantine/core';
import { Relation, RelationConfig } from '@megp/entity';
import { Mandate } from '@/models/mandate';

import {
  useLazySecondRelationQuery,
  useRelationMutation,
} from '../_api/role-permission.api';
import { useGetPermissionByOrganizationIdQuery } from '../_api/others.api';
import { useParams } from 'next/navigation';
import { notify } from '@megp/core-fe';
import { useReadQuery } from '../_api/role.api';

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

  const { data: selected } = useReadQuery(id?.toString());

  const relationConfig: RelationConfig<any> = {
    title: `${
      selected?.isSystemRole ? 'Permissions' : 'Permission assignment'
    } `,
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
    onSave: async (selected) => {
      const permissions = selected.map((item) => `${item.id}`);
      const data = {
        roleId: id?.toString(),
        permission: permissions,
      };

      try {
        await assignPermission(data).unwrap();
        notify('Success', 'Permission has been assigned to role successfully.');
      } catch (err) {
        notify(
          'Error',
          'Sorry, an error encountered while assigning permission.',
        );
      }
    },
    onAdd: () => {
      setIsModalOpen(true);
    },
    hasAdd: selected?.isSystemRole ? false : true,
  };
  const addConfig: RelationConfig<Mandate> = {
    title: 'Permission',
    columns: [
      {
        id: 'name',
        header: 'Permission Name',
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
    pagination: true,
    sortable: true,
    searchable: true,
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
        readOnly={selected?.isSystemRole ? true : false}
        collapsed={selected?.isSystemRole ? false : true}
      />
      <Modal
        title="permission assignment"
        opened={isModalOpen}
        onClose={handleCloseModal}
      >
        <Relation
          mode="modal"
          config={addConfig}
          data={permission ? permission.items : []}
          currentSelected={currentAssigned}
          handleCloseModal={handleCloseModal}
        />
      </Modal>
    </>
  );
};

export default AddUserModal;
