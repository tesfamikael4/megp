import React, { useEffect, useState } from 'react';
import { Modal, Stack } from '@mantine/core';
import { Relation, RelationConfig } from '@megp/entity';
import { User } from '@/models/user/user';
import { notifications } from '@mantine/notifications';

import {
  useAssignUserToUnitMutation,
  useGetUserByUnitIdQuery,
} from '../_api/others.api';
import { useParams } from 'next/navigation';
import { useListQuery } from '../../users/_api/user.api';
import { useReadQuery } from '../_api/unit.api';
import { logger } from '@megp/core-fe';

const AddUserModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAssigned, setCurrentAssigned] = useState<any[]>([]);
  const { id } = useParams();

  const [assignUnit, { isLoading: isSaving }] = useAssignUserToUnitMutation();
  const { data: unit } = useReadQuery(id?.toString());
  const {
    data: unitUser,
    isSuccess: userSucced,
    isLoading,
  } = useGetUserByUnitIdQuery(id?.toString());
  const { data: users } = useListQuery();

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
          unitId: id?.toString(),
          unitName: unit?.name,
        };
      });

      try {
        id && (await assignUnit({ data, id: id?.toString() }).unwrap());

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
    if (userSucced) {
      const data = unitUser?.userUnits.map((user: any) => user?.user);

      setCurrentAssigned(data);
    }
  }, [userSucced, unitUser?.userUnits]);
  logger.log(users);
  return (
    <>
      <Relation
        config={relationConfig}
        data={currentAssigned}
        isSaving={isSaving}
        isLoading={isLoading}
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
