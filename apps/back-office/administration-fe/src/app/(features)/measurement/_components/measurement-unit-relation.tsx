import React, { useState } from 'react';
import { Modal } from '@mantine/core';
import { Text } from '@mantine/core';
import { Relation, RelationConfig } from '@megp/entity';
import { useParams } from 'next/navigation';
import { MeasurementUnit } from '@/models/measurement-unit';
import { Unit } from './unit';
import { modals } from '@mantine/modals';
import { logger } from '@megp/core-fe';
import {
  useListByAppIdQuery as useListMeasurementId,
  useDeleteMutation,
} from '../_api/unit.api';
import { notifications } from '@mantine/notifications';

const AddUnit = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mode, setMode] = useState<'new' | 'detail'>('new');
  const [measurementId, setMeasurementId] = useState('');
  const { id } = useParams();

  const { data: unit, isSuccess } = useListMeasurementId(id?.toString());

  const [remove] = useDeleteMutation();

  const relationConfig: RelationConfig<MeasurementUnit> = {
    title: 'Unit of Measurement',
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
        id: 'abbreviation',
        header: 'Abbreviation',
        accessorKey: 'abbreviation',
        cell: (info) => info.getValue(),
        meta: {
          widget: 'primary',
        },
      },
    ],
    pagination: true,
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
        <Text size="sm">{`Are You Sure You Want To Delete This Unit of Measurement `}</Text>
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
      notifications.show({
        message: 'Unit of Measurement deleted successfully',
        title: 'error',
        color: 'red',
      });
    } catch (err) {
      notifications.show({
        message: 'Error in Deleting Unit of Measurement.',
        title: 'Error',
        color: 'red',
      });
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
        total={unit?.items.length}
      />
      <Modal
        title={mode === 'new' ? 'New Unit of Measurement' : 'Update Unit'}
        opened={isModalOpen}
        onClose={handleCloseModal}
      >
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
