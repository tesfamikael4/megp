import React, { useEffect, useState } from 'react';
import { Modal } from '@mantine/core';
import { Relation, RelationConfig } from '@megp/entity';
import { notifications } from '@mantine/notifications';
import {
  useLazySecondRelationQuery,
  useRelationMutation,
} from '../_api/mandate-permission.api';

import { useParams } from 'next/navigation';

import MandatePermission from './select-permission';

import { Permission } from '@/models/permission';

const AddPermission = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [currentAssigned, setCurrentAssigned] = useState<any[]>([]);
  const { id } = useParams();

  const [assignPermission, { isLoading: isSaving }] = useRelationMutation();

  const [trigger, { data: mandatePermission, isSuccess, isLoading }] =
    useLazySecondRelationQuery();

  const [permission, setPermission] = useState<Permission[]>([]);

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
        mandateId: id?.toString(),
        permission: permissions,
      };

      try {
        await assignPermission(data).unwrap();

        notifications.show({
          message: 'Permission  has been assigned to role successfully.',
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

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentAssigned(permission);
  };

  useEffect(() => {
    trigger(id?.toString());
  }, [id, trigger]);

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
        isLoading={isLoading}
        collapsed={false}
      />
      <Modal
        title="Permission"
        opened={isModalOpen}
        onClose={handleCloseModal}
        size={'sm'}
      >
        <MandatePermission
          permission={permission}
          setPermission={setPermission}
          setIsModalOpen={setIsModalOpen}
        />
      </Modal>
    </>
  );
};

export default AddPermission;
