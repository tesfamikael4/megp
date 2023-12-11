import React, { useEffect, useState } from 'react';
import { Modal } from '@mantine/core';
import { Relation, RelationConfig } from '@megp/entity';
import {
  useLazySecondRelationQuery,
  useRelationMutation,
} from '../_api/role-permission.api';
import { useParams } from 'next/navigation';
import { notify } from '@megp/core-fe';
import { useReadQuery } from '../_api/role.api';
import { useLazyGetPermissionByOrganizationIdQuery } from '../_api/others.api';
import MandatePermission from './permission-assign';
import { Permission } from '@/models/permission';
import { useAuth } from '@megp/auth';

const AddPermissionModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [permission, setPermission] = useState<Permission[]>([]);

  const [currentAssigned, setCurrentAssigned] = useState<any[]>([]);
  const { id } = useParams();

  const [assignPermission, { isLoading: isSaving }] = useRelationMutation();

  const [trigger, { data: rolePermision, isSuccess, isLoading }] =
    useLazySecondRelationQuery();

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

  const handleCloseModal = () => {
    setIsModalOpen(false);
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
      setPermission(
        rolePermision
          ? rolePermision.items.map((permission: any) => permission.permission)
          : [],
      );
    }
  }, [rolePermision, isSuccess]);

  useEffect(() => {
    setCurrentAssigned(permission);
  }, [permission]);

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
        title="Permission assignment"
        opened={isModalOpen}
        onClose={handleCloseModal}
        size={'lg'}
      >
        <MandatePermission
          permission={permission}
          setPermission={setPermission}
          setIsModalOpen={setIsModalOpen}
          handleCloseModal={handleCloseModal}
        />
      </Modal>
    </>
  );
};

export default AddPermissionModal;
