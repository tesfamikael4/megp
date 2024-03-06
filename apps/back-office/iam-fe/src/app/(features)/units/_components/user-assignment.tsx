import React, { useEffect, useState } from 'react';
import { Modal, Text } from '@mantine/core';
import { CollectionQuery, Relation, RelationConfig } from '@megp/entity';
import { User } from '@/models/user/user';
import {
  useReverseRelationMutation,
  useLazyFirstRelationQuery,
} from '../../../users/_api/user-unit.api';
import { useParams } from 'next/navigation';

import { useLazyListByIdQuery } from '../../../users/_api/user.api';
import { notify } from '@megp/core-fe';
import { useAuth } from '@megp/auth';

const AddUserModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAssigned, setCurrentAssigned] = useState<any[]>([]);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(true);

  const { id } = useParams();
  const { organizationId } = useAuth();

  const [assign, { isLoading: isSaving }] = useReverseRelationMutation();
  const [trigger, { data: users, isSuccess, isLoading }] =
    useLazyFirstRelationQuery();

  const [triggerData, { data, isLoading: isFetching }] = useLazyListByIdQuery();

  const relationConfig: RelationConfig<User> = {
    title: 'User Assignment',
    columns: [
      {
        id: 'name',
        header: 'Name',
        accessorKey: 'firstName',
        cell: (info) => (
          <div>
            {info.row.original.firstName + ' ' + info.row.original.lastName}
          </div>
        ),
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
    title: 'Users assignment',
    columns: [
      {
        id: 'name',
        header: 'Name',
        accessorKey: 'account.firstName',
        cell: (info) => (
          <div>
            {info.row.original.firstName + ' ' + info.row.original.lastName}
          </div>
        ),
        meta: {
          widget: 'expand',
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
    if (!isCollapsed) {
      trigger({ id: id?.toString(), collectionQuery: undefined });
    }
  }, [id, isCollapsed, trigger]);

  useEffect(() => {
    if (isSuccess && !isCollapsed) {
      setCurrentAssigned(
        users
          ? users.items.map((user: any) => user.user !== null && user.user)
          : [],
      );
    }
  }, [users, isSuccess, isCollapsed]);

  const onRequestChange = (request: CollectionQuery) => {
    triggerData({ id: organizationId, collectionQuery: request });
  };

  return (
    <>
      <Relation
        config={relationConfig}
        data={currentAssigned}
        isSaving={isSaving}
        isLoading={isLoading}
        setIsCollapsed={setIsCollapsed}
      />
      <Modal
        title={<Text fw={'bold'}>User Assignment</Text>}
        opened={isModalOpen}
        onClose={handleCloseModal}
        size={'lg'}
      >
        <Relation
          config={addConfig}
          data={data ? data.items : []}
          currentSelected={currentAssigned}
          mode="modal"
          isLoading={isFetching}
          handleCloseModal={handleCloseModal}
          onRequestChange={onRequestChange}
          total={data?.total ?? 0}
        />
      </Modal>
    </>
  );
};

export default AddUserModal;
