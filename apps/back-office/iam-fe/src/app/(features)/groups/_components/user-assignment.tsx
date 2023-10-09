import React, { useEffect, useState } from 'react';
import { Modal } from '@mantine/core';
import { Relation, RelationConfig } from '@megp/entity';
import { notifications } from '@mantine/notifications';
import { logger } from '@megp/core-fe';
import {
  useAssignUserToGroupMutation,
  useGetUserByGroupIdQuery,
} from '../_api/user-group.api';
import { useParams } from 'next/navigation';
import { useListQuery } from '../../users/_api/user.api';
import { useReadQuery } from '../_api/group.api';
import { User } from '@/models/user/user';

const AddUserModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAssigned, setCurrentAssigned] = useState<User[]>([]);
  const { id } = useParams();

  const [assignUnit, { isLoading: isSaving }] = useAssignUserToGroupMutation();
  const { data: unit } = useReadQuery(id?.toString());
  const { data: unitUser, isSuccess: usersucced } = useGetUserByGroupIdQuery(
    id?.toString(),
  );
  const { data: users } = useListQuery();
  logger.log(users);

  const relationConfig: RelationConfig<User> = {
    title: 'Users',
    columns: [
      {
        id: 'fullName',
        header: 'Name',
        accessorKey: 'fullName',
        cell: (info) => info.getValue(),
        meta: {
          widget: 'primary',
        },
      },
    ],
    onSave: async () => {
      const data = currentAssigned.map((user) => {
        return {
          userId: user.id,
          groupId: id?.toString(),
          groupName: unit?.name,
        };
      });
      logger.log(id);
      try {
        id && (await assignUnit(data).unwrap());

        notifications.show({
          message: 'user has been assigned to unit successfully.',
          title: 'Sucess',
          color: 'green',
        });
      } catch (err) {
        notifications.show({
          message: 'Sorry, an error encountered while assigining user.',
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
        id: 'fullName',
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
    if (usersucced) {
      const data = unitUser?.items?.map((user: any) => user?.user);
      setCurrentAssigned(data);
    }
  }, [usersucced]);

  return (
    <>
      <Relation
        config={relationConfig}
        data={currentAssigned}
        isSaving={isSaving}
        isLoading={isSaving}
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
