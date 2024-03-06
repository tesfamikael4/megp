import React, { useEffect, useState } from 'react';
import { Modal, Text } from '@mantine/core';
import { CollectionQuery, Relation, RelationConfig } from '@megp/entity';

import {
  useRelationMutation,
  useLazySecondRelationQuery,
} from '../../_api/user-unit.api';
import { useParams } from 'next/navigation';
import { useLazyListByIdQuery } from '../../../(features)/units/_api/unit.api';
import { Unit } from '@/models/unit';
import { notify } from '@megp/core-fe';
import { useAuth } from '@megp/auth';

const AddEntityModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAssigned, setCurrentAssigned] = useState<Unit[]>([]);
  const { id } = useParams();
  const { organizationId } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState<boolean>(true);

  const [assign, { isLoading: isSaving }] = useRelationMutation();
  const [trigger, { data: units, isSuccess, isLoading }] =
    useLazySecondRelationQuery();

  const [triggerData, { data, isFetching }] = useLazyListByIdQuery();

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
    if (!isCollapsed) {
      trigger({
        id: id?.toString(),
        collectionQuery: undefined,
      });
    }
  }, [id, isCollapsed, trigger]);

  useEffect(() => {
    if (isSuccess) {
      setCurrentAssigned(
        units ? units.items.map((unit: any) => unit.unit) : [],
      );
    }
  }, [units, isSuccess]);

  const onRequestChange = (request: CollectionQuery) => {
    organizationId !== undefined &&
      isModalOpen &&
      triggerData({ id: organizationId, collectionQuery: request });
  };

  return (
    <>
      <Relation
        config={relationConfig}
        data={currentAssigned}
        isSaving={isSaving}
        setIsCollapsed={setIsCollapsed}
        isLoading={isLoading}
      />
      <Modal
        title={<Text fw={'bold'}>Unit Assignment</Text>}
        opened={isModalOpen}
        onClose={handleCloseModal}
        size={'lg'}
      >
        <Relation
          config={addConfig}
          mode="modal"
          data={data ? data.items : []}
          currentSelected={currentAssigned}
          handleCloseModal={handleCloseModal}
          onRequestChange={onRequestChange}
          total={data?.total ?? 0}
          isLoading={isFetching}
        />
      </Modal>
    </>
  );
};

export default AddEntityModal;
