import React, { useEffect, useState } from 'react';
import { Modal } from '@mantine/core';
import { Relation, RelationConfig } from '@megp/entity';

import { notifications } from '@mantine/notifications';

// import { useGetUnitByUserIdQuery } from '../_api/user.api';
import {
  useRelationMutation,
  useLazySecondRelationQuery,
} from '../_api/user-unit.api';
import { useParams } from 'next/navigation';
import { useListByIdQuery } from '../../units/_api/unit.api';
import { Unit } from '@/models/unit';

const AddEntityModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAssigned, setCurrentAssigned] = useState<Unit[]>([]);
  const { id } = useParams();

  const [assign, { isLoading: isSaving }] = useRelationMutation();
  const [trigger, { data: units, isSuccess }] = useLazySecondRelationQuery();
  const { data: list } = useListByIdQuery();

  const relationConfig: RelationConfig<Unit> = {
    title: 'Units Assignment',
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
      const units = selected.map((item) => `${item.id}`);
      const data = {
        userId: id?.toString(),
        unit: units,
      };

      try {
        id && (await assign(data).unwrap());

        notifications.show({
          message: 'Unit has been assigned to user successfully.',
          title: 'Success',
          color: 'green',
        });
      } catch (err) {
        notifications.show({
          message: 'Sorry, an error encountered while assigning unit.',
          title: 'Error',
          color: 'red',
        });
      }
    },
    onAdd: () => {
      setIsModalOpen(true);
    },
  };
  const addConfig: RelationConfig<Unit> = {
    title: 'Units',
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
        units ? units.items.map((unit: any) => unit.unit) : [],
      );
    }
  }, [units, isSuccess]);

  return (
    <>
      <Relation
        config={relationConfig}
        data={currentAssigned}
        isSaving={isSaving}
      />
      <Modal title="Unit" opened={isModalOpen} onClose={handleCloseModal}>
        <Relation
          config={addConfig}
          mode="modal"
          data={list ? list.items : []}
          currentSelected={currentAssigned}
        />
      </Modal>
    </>
  );
};

export default AddEntityModal;
