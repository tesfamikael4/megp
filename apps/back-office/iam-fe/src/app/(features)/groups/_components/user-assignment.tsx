import React, { useEffect, useState } from 'react';
import { Modal } from '@mantine/core';
import { CollectionQuery, Relation, RelationConfig } from '@megp/entity';
import { useParams } from 'next/navigation';
import { useLazyListByIdQuery } from '../../../users/_api/user.api';
import {
  useReverseRelationMutation,
  useLazyFirstRelationQuery,
} from '../_api/user-group.api';
import { User } from '@/models/user/user';
import { logger, notify } from '@megp/core-fe';
import { useAuth } from '@megp/auth';

const AddUserModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [currentAssigned, setCurrentAssigned] = useState<User[]>([]);
  const { id } = useParams();
  const { user } = useAuth();

  const [assignUser, { isLoading: isSaving }] = useReverseRelationMutation();
  const [trigger, { data: users, isSuccess: userSucceed }] =
    useLazyFirstRelationQuery();

  const [triggerData, { data, isFetching }] = useLazyListByIdQuery();

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
        groupId: id?.toString(),
        user: users,
      };

      try {
        id && (await assignUser(data).unwrap());
        notify('Success', 'User has been assigned to group successfully.');
      } catch (err) {
        notify('Error', 'Sorry, an error encountered while assigning user.');
      }
    },
    onAdd: () => {
      setIsModalOpen(true);
    },
  };
  const addConfig: RelationConfig<User> = {
    title: 'User assignment',
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
    sortable: true,
    searchable: true,
    pagination: true,
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (userSucceed) {
      setCurrentAssigned(
        users ? users.items.map((user: any) => user.user) : [],
      );
    }
  }, [users, userSucceed]);

  const onRequestChange = (request: CollectionQuery) => {
    triggerData({ id: user?.organization?.id, collectionQuery: request });
  };
  const onRequestChangeList = (request: CollectionQuery) => {
    trigger({ id: id?.toString(), collectionQuery: undefined });
  };

  return (
    <>
      <Relation
        config={relationConfig}
        data={currentAssigned}
        isSaving={isSaving}
        onRequestChange={onRequestChangeList}
      />
      <Modal
        title="User assignment"
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
          total={data?.total ?? 0}
          isLoading={isFetching}
        />
      </Modal>
    </>
  );
};

export default AddUserModal;
