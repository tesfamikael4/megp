import React, { useEffect, useState } from 'react';
import { Modal } from '@mantine/core';
import { Relation, RelationConfig } from '@megp/entity';
import { notifications } from '@mantine/notifications';
import {
  useRelationMutation,
  useLazySecondRelationQuery,
} from '../../groups/_api/user-group.api';
import { useParams } from 'next/navigation';
import { useListQuery } from '../../groups/_api/group.api';
import { Group } from '@/models/group';
import { notify } from '@megp/core-fe';

const AddEntityModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAssigned, setCurrentAssigned] = useState<Group[]>([]);
  const { id } = useParams();

  const [assign, { isLoading: isSaving }] = useRelationMutation();

  const [trigger, { data: groups, isSuccess }] = useLazySecondRelationQuery();
  const { data: list } = useListQuery();

  const relationConfig: RelationConfig<Group> = {
    title: 'Group Assignment',
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
      {
        id: 'description',
        header: 'Description',
        accessorKey: 'description',
        cell: (info) => info.getValue(),
        meta: {
          widget: 'multiline',
        },
      },
    ],
    onSave: async (selected) => {
      const groups = selected.map((item) => `${item.id}`);
      const data = {
        userId: id?.toString(),
        group: groups,
      };

      try {
        id && (await assign(data).unwrap());
        notify('Success', 'Group has been assigned to user successfully.');
      } catch (err) {
        notify('Error', 'Sorry, an error encountered while assigning role.');
      }
    },
    onAdd: () => {
      setIsModalOpen(true);
    },
  };
  const addConfig: RelationConfig<Group> = {
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
        groups ? groups.items.map((group: any) => group.group) : [],
      );
    }
  }, [groups, isSuccess]);

  return (
    <>
      <Relation
        config={relationConfig}
        data={currentAssigned}
        isSaving={isSaving}
      />
      <Modal title="Roles" opened={isModalOpen} onClose={handleCloseModal}>
        <Relation
          config={addConfig}
          data={list ? list.items : []}
          mode="modal"
          currentSelected={currentAssigned}
        />
      </Modal>
    </>
  );
};

export default AddEntityModal;
