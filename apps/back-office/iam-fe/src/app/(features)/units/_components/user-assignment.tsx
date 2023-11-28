import React, { useEffect, useState } from 'react';
import { Modal } from '@mantine/core';
import { CollectionQuery, Relation, RelationConfig } from '@megp/entity';
import { User } from '@/models/user/user';
import {
  useReverseRelationMutation,
  useLazyFirstRelationQuery,
} from '../../../users/_api/user-unit.api';
import { useParams } from 'next/navigation';

import { useLazyListByIdQuery } from '../../../users/_api/user.api';
import { logger, notify } from '@megp/core-fe';
import { useAuth } from '@megp/auth';

const AddUserModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAssigned, setCurrentAssigned] = useState<any[]>([]);

  const { id } = useParams();
  const { user } = useAuth();

  const [assign, { isLoading: isSaving }] = useReverseRelationMutation();
  const [trigger, { data: users, isSuccess }] = useLazyFirstRelationQuery();

  const [triggerData, { data }] = useLazyListByIdQuery();

  const relationConfig: RelationConfig<User> = {
    title: 'User Assignment',
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
        notify('Success', 'User has been assigned to unit successfully.');
      } catch (err) {
        notify('Error', 'Sorry, an error encountered while assigning user.');
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
        header: 'Name',
        accessorKey: 'fullName',
        cell: (info) => info.getValue(),
        meta: {
          widget: 'primary',
        },
      },
      {
        id: 'email',
        header: 'Email',
        accessorKey: 'email',
        cell: (info) => info.getValue(),
      },
    ],
    onSave: (selected) => {
      setCurrentAssigned(selected);
      setIsModalOpen(false);
    },

    selectable: true,
    searchable: true,
    sortable: true,
    pagination: true,
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    trigger({ id: id?.toString(), collectionQuery: undefined });
  }, [id, trigger]);

  useEffect(() => {
    if (isSuccess) {
      setCurrentAssigned(
        users
          ? users.items.map((user: any) => user.user !== null && user.user)
          : [],
      );
    }
  }, [users, isSuccess]);

  const onRequestChange = (request: CollectionQuery) => {
    triggerData({ id: user?.organization?.id, collectionQuery: request });
  };

  return (
    <>
      <Relation
        config={relationConfig}
        data={currentAssigned}
        isSaving={isSaving}
      />
      <Modal
        title="User Assignment"
        opened={isModalOpen}
        onClose={handleCloseModal}
        size={'lg'}
      >
        <Relation
          config={addConfig}
          data={data ? data.items : []}
          currentSelected={currentAssigned}
          mode="modal"
          handleCloseModal={handleCloseModal}
          onRequestChange={onRequestChange}
        />
      </Modal>
    </>
  );
};

export default AddUserModal;
