import React, { useState } from 'react';
import { Modal } from '@mantine/core';
import { Text } from '@mantine/core';
import { Relation, RelationConfig } from '@megp/entity';
import { useParams } from 'next/navigation';
import { MeasurementUnit } from '@/models/measurement-unit';
import { Unit } from './unit';
import { modals } from '@mantine/modals';
import { logger, notify } from '@megp/core-fe';
import {
  useListByAppIdQuery as useListMeasurementId,
  useDeleteMutation,
} from '../_api/unit.api';

const AddUnit = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mode, setMode] = useState<'new' | 'detail'>('new');
  const [measurementId, setMeasurementId] = useState('');
  const { id } = useParams();

  const { data: unit, isSuccess } = useListMeasurementId(id?.toString());

  const [remove] = useDeleteMutation();

  const relationConfig: RelationConfig<MeasurementUnit> = {
    title: 'Measurement Unit',
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
        id: 'shortName',
        header: 'Abbreviations',
        accessorKey: 'shortName',
        cell: (info) => info.getValue(),
        meta: {
          widget: 'primary',
        },
      },
    ],

    onAdd: () => {
      setMode('new');
      setIsModalOpen(true);
    },
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const openDeleteModal = (id) => {
    modals.openConfirmModal({
      title: `Delete `,
      centered: true,
      children: (
        <Text size="sm">{`Are you sure you want to delete this unit `}</Text>
      ),
      labels: { confirm: 'Yes', cancel: 'No' },
      confirmProps: { color: 'red' },
      onConfirm: () => {
        onDelete(id);
      },
    });
  };

  const onDelete = async (id) => {
    try {
      await remove(id).unwrap();
      notify('Success', 'Unit deleted successfully');
    } catch (err) {
      notify('Error', 'Errors in deleting unit.');
    }
  };

  const openEditModal = (id) => {
    logger.log(id);
    setIsModalOpen(true);
    setMeasurementId(id);
    setMode('detail');
  };

  return (
    <>
      <Relation
        config={relationConfig}
        data={isSuccess ? unit.items : []}
        showPopUp={true}
        openDeleteModal={openDeleteModal}
        openEditModal={openEditModal}
        collapsed={false}
      />
      <Modal title="unit" opened={isModalOpen} onClose={handleCloseModal}>
        <Unit
          mode={mode}
          handleCloseModal={handleCloseModal}
          measurementId={measurementId}
        />
      </Modal>
    </>
  );
};

export default AddUnit;
