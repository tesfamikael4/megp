import React, { useEffect, useState } from 'react';
import { Modal } from '@mantine/core';
import { CollectionQuery, Relation, RelationConfig } from '@megp/entity';
import {
  useLazySecondRelationQuery,
  useRelationMutation,
} from '../_api/role-permission.api';
import { useParams } from 'next/navigation';
import { notify } from '@megp/core-fe';
import MandatePermission from './permission-assign';
import { Permission } from '@/models/permission';

const AddPermissionModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [permission, setPermission] = useState<Permission[]>([]);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(true);

  const [currentAssigned, setCurrentAssigned] = useState<any[]>([]);
  const { id } = useParams();

  const [assignPermission, { isLoading: isSaving }] = useRelationMutation();

  const [trigger, { data: rolePermision, isSuccess, isLoading }] =
    useLazySecondRelationQuery();

  const relationConfig: RelationConfig<any> = {
    title: 'Permission Assignment',
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
    hasAdd: true,
    pagination: true,
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

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
    !isCollapsed && onRequestChange({ skip: 0, take: 15 });
  }, [isCollapsed]);

  useEffect(() => {
    setCurrentAssigned(permission);
  }, [permission]);

  const onRequestChange = (request: CollectionQuery) => {
    !isCollapsed &&
      trigger({
        id: id?.toString(),
        collectionQuery: request,
      });
  };

  return (
    <>
      <Relation
        config={relationConfig}
        data={currentAssigned ? currentAssigned : []}
        isSaving={isSaving}
        isLoading={isLoading}
        total={rolePermision?.total ?? 0}
        onRequestChange={onRequestChange}
        readOnly={false}
        collapsed={true}
        setIsCollapsed={setIsCollapsed}
      />
      <Modal
        title="Permission Assignment"
        opened={isModalOpen}
        onClose={handleCloseModal}
        size={'xl'}
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
