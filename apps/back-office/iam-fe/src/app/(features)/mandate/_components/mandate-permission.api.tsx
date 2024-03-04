import React, { useEffect, useState } from 'react';
import { Modal } from '@mantine/core';
import { CollectionQuery, Relation, RelationConfig } from '@megp/entity';
import {
  useLazySecondRelationQuery,
  useRelationMutation,
} from '../_api/mandate-permission.api';

import { useParams } from 'next/navigation';

import MandatePermission from './select-permission';

import { Permission } from '@/models/permission';
import { notify } from '@megp/core-fe';

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
        mandateId: id?.toString(),
        permission: permissions,
      };

      try {
        await assignPermission(data).unwrap();
        notify(
          'Success',
          'Permission has been assigned to mandate successfully.',
        );
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
    pagination: true,
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentAssigned(permission);
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
        onRequestChange={onRequestChange}
        isSaving={isSaving}
        isLoading={isLoading}
        total={mandatePermission?.total ?? 0}
        collapsed={false}
      />
      <Modal
        title="Permission assignment"
        opened={isModalOpen}
        onClose={handleCloseModal}
        size={'xl'}
        lockScroll={false}
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

export default AddPermission;
