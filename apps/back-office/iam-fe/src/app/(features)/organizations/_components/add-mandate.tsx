import React, { useEffect, useState } from 'react';
import { Modal } from '@mantine/core';
import { CollectionQuery, Relation, RelationConfig } from '@megp/entity';
import { Mandate } from '@/models/mandate';
import { useLazyMandateToAssignQuery } from '../_api/custom.api';
import {
  useRelationMutation,
  useLazySecondRelationQuery,
} from '../_api/organization-mandate.api';
import { useParams } from 'next/navigation';
import { notify } from '@megp/core-fe';

const AddEntityModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(true);

  const [currentAssigned, setCurrentAssigned] = useState<any[]>([]);
  const { id } = useParams();

  const [assignMandates, { isLoading: isSaving }] = useRelationMutation();

  const [triggerMandate, { data, isFetching }] = useLazyMandateToAssignQuery();

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
    ],
    onSave: async (selected) => {
      const mandates = selected.map((item) => `${item.id}`);
      const data = {
        organizationId: id?.toString(),
        mandate: mandates,
      };

      try {
        id && (await assignMandates(data).unwrap());
        notify(
          'Success',
          'Mandate has been assigned to organization successfully.',
        );
      } catch (err) {
        notify('Error', 'Sorry, an error encountered while assigning mandate.');
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
        organizationMandates
          ? organizationMandates.items.map((mandate: any) => mandate.mandate)
          : [],
      );
    }
  }, [isSuccess, organizationMandates]);

  const onRequestChange = (request: CollectionQuery) => {
    isModalOpen &&
      id &&
      triggerMandate({ id: id.toString(), collectionQuery: request });
  };

  return (
    <>
      <Relation
        config={relationConfig}
        data={currentAssigned}
        setIsCollapsed={setIsCollapsed}
        isSaving={isSaving}
      />
      <Modal
        title="Mandate Assignment"
        opened={isModalOpen}
        onClose={handleCloseModal}
        size={'lg'}
      >
        <Relation
          config={addConfig}
          data={data ? data.items : []}
          mode="modal"
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
