import React, { useEffect, useState } from 'react';
import { Modal } from '@mantine/core';
import { Relation, RelationConfig } from '@megp/entity';
import { Mandate } from '@/models/mandate';
import { notifications } from '@mantine/notifications';
import {
  useAddOrganizationMandateMutation,
  useGetMandateByOrganizationQuery,
  useGetOrganiationMandateQuery,
} from '../_api/mandate.api';
import { useParams } from 'next/navigation';

const AddEntityModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAssignedMandates, setCurrentAssignedMandates] = useState<any[]>(
    [],
  );
  const { id } = useParams();

  const [assignMandates, { isLoading: isSaving }] =
    useAddOrganizationMandateMutation();

  const { data: mandats, isLoading } = useGetMandateByOrganizationQuery(
    id?.toString(),
  );
  const { data: organizationMandates, isSuccess } =
    useGetOrganiationMandateQuery(id?.toString());

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
    onSave: async () => {
      const dataSent = currentAssignedMandates.map((item) => {
        return {
          mandateId: item?.id,
          mandateName: item?.name,
          organizationId: id?.toString(),
          isSingleAssignment: item?.isSingleAssignment,
        };
      });

      try {
        id && (await assignMandates({ dataSent, id: id?.toString() }).unwrap());

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
      setCurrentAssignedMandates(selected);
      setIsModalOpen(false);
    },

    selectable: true,
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (isSuccess) {
      const data = organizationMandates?.organizationMandates?.map(
        (manda: any) => manda?.mandate,
      );

      setCurrentAssignedMandates(data);
    }
  }, [assignMandates, isSuccess, organizationMandates?.organizationMandates]);

  return (
    <>
      <Relation
        config={relationConfig}
        data={currentAssignedMandates}
        isSaving={isSaving}
        isLoading={isLoading}
      />
      <Modal title="Add Entity" opened={isModalOpen} onClose={handleCloseModal}>
        <Relation
          config={addConfig}
          data={mandats ? mandats.items : []}
          mode="modal"
          currentSelected={currentAssignedMandates}
        />
      </Modal>
    </>
  );
};

export default AddEntityModal;
