import React, { useEffect, useState } from 'react';
import { Modal } from '@mantine/core';
import { Relation, RelationConfig } from '@megp/entity';

import {
  useRelationMutation,
  useLazySecondRelationQuery,
} from '../../_api/user-role.api';
import { useParams } from 'next/navigation';
import { useListByIdQuery } from '../../../(features)/roles/_api/role.api';
import { Role } from '@/models/role';
import { notify } from '@megp/core-fe';

const AddEntityModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAssigned, setCurrentAssigned] = useState<Role[]>([]);
  const { id } = useParams();

  const [assign, { isLoading: isSaving }] = useRelationMutation();

  const [trigger, { data: roles, isSuccess }] = useLazySecondRelationQuery();
  const { data: list } = useListByIdQuery();

  const relationConfig: RelationConfig<Role> = {
    title: 'Roles Assignment',
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
      const roles = selected.map((item) => `${item.id}`);
      const data = {
        userId: id?.toString(),
        role: roles,
      };

      try {
        id && (await assign(data).unwrap());
        notify('Success', 'Role has been assigned to user successfully.');
      } catch (err) {
        notify('Error', 'Sorry, an error encountered while assigning role.');
      }
    },
    onAdd: () => {
      setIsModalOpen(true);
    },
  };
  const addConfig: RelationConfig<Role> = {
    title: 'Roles',
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
    trigger(id?.toString());
  }, [id, trigger]);
  useEffect(() => {
    if (isSuccess) {
      setCurrentAssigned(
        roles ? roles.items.map((role: any) => role.role) : [],
      );
    }
  }, [roles, isSuccess]);

  return (
    <>
      <Relation
        config={relationConfig}
        data={currentAssigned}
        isSaving={isSaving}
      />
      <Modal
        title="Roles"
        opened={isModalOpen}
        onClose={handleCloseModal}
        size={'lg'}
      >
        <Relation
          config={addConfig}
          data={list ? list.items : []}
          mode="modal"
          currentSelected={currentAssigned}
          handleCloseModal={handleCloseModal}
        />
      </Modal>
    </>
  );
};

export default AddEntityModal;
