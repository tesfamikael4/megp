import React, { useEffect, useState } from 'react';
import { Modal } from '@mantine/core';
import { Relation, RelationConfig } from '@megp/entity';

import {
  useRelationMutation,
  useLazySecondRelationQuery,
} from '../../_api/user-unit.api';
import { useParams } from 'next/navigation';
import { useListByIdQuery } from '../../../(features)/units/_api/unit.api';
import { Unit } from '@/models/unit';
import { notify } from '@megp/core-fe';

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
    ],
    onSave: async (selected) => {
      const units = selected.map((item) => `${item.id}`);
      const data = {
        userId: id?.toString(),
        unit: units,
      };

      try {
        id && (await assign(data).unwrap());
        notify('Success', 'Unit has been assigned to user successfully.');
      } catch (err) {
        notify('Error', 'Sorry, an error encountered while assigning unit.');
      }
    },
    onAdd: () => {
      setIsModalOpen(true);
    },
  };
  const addConfig: RelationConfig<Unit> = {
    title: 'Unit Assignment',
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
    searchable: true,
    sortable: true,
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
      <Modal
        title="Unit Assignment"
        opened={isModalOpen}
        onClose={handleCloseModal}
        size={'lg'}
      >
        <Relation
          config={addConfig}
          mode="modal"
          data={list ? list.items : []}
          currentSelected={currentAssigned}
          handleCloseModal={handleCloseModal}
        />
      </Modal>
    </>
  );
};

export default AddEntityModal;
