import React, { useEffect, useState } from 'react';
import { Modal } from '@mantine/core';
import { Relation, RelationConfig } from '@megp/entity';
import { User } from '@/models/user/user';
import { notifications } from '@mantine/notifications';

import {
  useRelationMutation,
  useLazyFirstRelationQuery,
} from '../../users/_api/user-unit.api';
import { useParams } from 'next/navigation';
import { useListByIdQuery } from '../../users/_api/user.api';

const AddUserModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAssigned, setCurrentAssigned] = useState<any[]>([]);

  const { id } = useParams();

  const [assign, { isLoading: isSaving }] = useRelationMutation();
  const [trigger, { data: users, isSuccess }] = useLazyFirstRelationQuery();

  const { data: list } = useListByIdQuery(
    '099454a9-bf8f-45f5-9a4f-6e9034230250',
  );

  const relationConfig: RelationConfig<User> = {
    title: 'Users Assignment',
    columns: [
      {
        id: 'name',
        header: 'Name',
        accessorKey: 'fullName',
        cell: (info) => info.getValue(),
        meta: {
          widget: 'primary',
        },
      },
    ],
    onSave: async (selected) => {
      const users = selected.map((item) => `${item.id}`);
      const data = {
        unitId: id?.toString(),
        user: users,
      };

      try {
        id && (await assign(data).unwrap());

        notifications.show({
          message: 'user has been assigned to unit successfully.',
          title: 'Sucess',
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
  const addConfig: RelationConfig<User> = {
    title: 'Users',
    columns: [
      {
        id: 'name',
        header: 'name',
        accessorKey: 'fullName',
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
        users ? users.items.map((user: any) => user.user) : [],
      );
    }
  }, [users, isSuccess]);

  return (
    <>
      <Relation
        config={relationConfig}
        data={currentAssigned}
        isSaving={isSaving}
      />
      <Modal title="Users" opened={isModalOpen} onClose={handleCloseModal}>
        <Relation
          config={addConfig}
          data={list ? list.items : []}
          currentSelected={currentAssigned}
          mode="modal"
        />
      </Modal>
    </>
  );
};

export default AddUserModal;
