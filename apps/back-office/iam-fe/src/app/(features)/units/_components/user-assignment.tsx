import React, { useEffect, useState } from 'react';
import { Modal } from '@mantine/core';
import { Relation, RelationConfig } from '@megp/entity';
import { User } from '@/models/user/user';
import { notifications } from '@mantine/notifications';

import {
  useReverseRelationMutation,
  useLazyFirstRelationQuery,
} from '../../users/_api/user-unit.api';
import { useParams } from 'next/navigation';
import { useListByIdQuery } from '../../users/_api/user.api';
import { notify } from '@megp/core-fe';

const AddUserModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAssigned, setCurrentAssigned] = useState<any[]>([]);

  const { id } = useParams();

  const [assign, { isLoading: isSaving }] = useReverseRelationMutation();
  const [trigger, { data: users, isSuccess }] = useLazyFirstRelationQuery();

  const { data: list } = useListByIdQuery();

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
        notify('Error', 'User has been assigned to unit successfully.');
      } catch (err) {
        notify('Success', 'Sorry, an error encountered while assigning user.');
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
