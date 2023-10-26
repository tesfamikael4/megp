import React, { useEffect, useState } from 'react';
import { Modal } from '@mantine/core';
import { Relation, RelationConfig } from '@megp/entity';
import { notifications } from '@mantine/notifications';
import { useParams } from 'next/navigation';
import { useListByIdQuery } from '../../users/_api/user.api';
import {
  useRelationMutation,
  useLazyFirstRelationQuery,
} from '../_api/user-group.api';
import { User } from '@/models/user/user';

const AddUserModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [currentAssigned, setCurrentAssigned] = useState<User[]>([]);
  const { id } = useParams();

  const [assignUser, { isLoading: isSaving }] = useRelationMutation();
  const [trigger, { data: user, isSuccess: userSucceed }] =
    useLazyFirstRelationQuery();

  const { data: users } = useListByIdQuery(
    '099454a9-bf8f-45f5-9a4f-6e9034230250',
  );

  const relationConfig: RelationConfig<User> = {
    title: 'Users Assignment',
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
    onSave: async (selected) => {
      const users = selected.map((item) => `${item.id}`);
      const data = {
        groupId: id?.toString(),
        user: users,
      };

      try {
        id && (await assignUser(data).unwrap());

        notifications.show({
          message: 'User has been assigned to group successfully.',
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
  const addConfig: RelationConfig<User> = {
    title: 'Users ',
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
    if (userSucceed) {
      setCurrentAssigned(user ? user.items.map((user: any) => user.user) : []);
    }
  }, [user, userSucceed]);

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
          data={users ? users.items : []}
          currentSelected={currentAssigned}
          mode="modal"
        />
      </Modal>
    </>
  );
};

export default AddUserModal;
