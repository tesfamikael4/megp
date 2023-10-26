import React, { useEffect, useState } from 'react';
import { Modal } from '@mantine/core';
import { Relation, RelationConfig } from '@megp/entity';

import { Mandate } from '@/models/mandate';
import { notifications } from '@mantine/notifications';
import { useListQuery } from '../_api/mandate.api';
import {
  useRelationMutation,
  useLazySecondRelationQuery,
} from '../_api/organization-mandate.api';
import { useParams } from 'next/navigation';

const AddEntityModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [currentAssigned, setCurrentAssigned] = useState<any[]>([]);
  const { id } = useParams();

  const [assignMandates, { isLoading: isSaving }] = useRelationMutation();

  const { data: mandates } = useListQuery();

  const [trigger, { data: organizationMandates, isSuccess }] =
    useLazySecondRelationQuery();

  const relationConfig: RelationConfig<Mandate> = {
    title: 'Mandate',
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
      const mandates = selected.map((item) => `${item.id}`);
      const data = {
        organizationId: id?.toString(),
        mandate: mandates,
      };

      try {
        id && (await assignMandates(data).unwrap());

        notifications.show({
          message: 'Mandate has been assigned to organization successfully.',
          title: 'Success',
          color: 'green',
        });
      } catch (err) {
        notifications.show({
          message: 'Sorry, an error encountered while assigning mandate.',
          title: 'Error',
          color: 'red',
        });
      }
    },
    onAdd: () => {
      setIsModalOpen(true);
    },
  };
  const addConfig: RelationConfig<Mandate> = {
    title: 'Mandate',
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
        organizationMandates
          ? organizationMandates.items.map((mandate: any) => mandate.mandate)
          : [],
      );
    }
  }, [isSuccess, organizationMandates]);

  return (
    <>
      <Relation
        config={relationConfig}
        data={currentAssigned}
        isSaving={isSaving}
      />
      <Modal title="Add Entity" opened={isModalOpen} onClose={handleCloseModal}>
        <Relation
          config={addConfig}
          data={mandates ? mandates.items : []}
          mode="modal"
          currentSelected={currentAssigned}
        />
      </Modal>
    </>
  );
};

export default AddEntityModal;
