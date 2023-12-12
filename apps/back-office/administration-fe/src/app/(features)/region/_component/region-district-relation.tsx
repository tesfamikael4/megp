import React, { useState } from 'react';
import { Modal } from '@mantine/core';
import { Text } from '@mantine/core';
import { Relation, RelationConfig } from '@megp/entity';
import { useParams } from 'next/navigation';
import { modals } from '@mantine/modals';
import { logger, notify } from '@megp/core-fe';
import {
  useListByAppIdQuery as useListRegionId,
  useDeleteMutation,
} from '../_api/district.api';
import { District } from '@/models/district';
import { DistrictForm } from './district';

const AddDistrict = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mode, setMode] = useState<'new' | 'detail'>('new');
  const [regionId, setRegionId] = useState('');
  const { id } = useParams();

  const { data: district, isSuccess } = useListRegionId(id?.toString());

  const [remove] = useDeleteMutation();

  const relationConfig: RelationConfig<District> = {
    title: 'District ',
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
        <Text size="sm">{`Are you sure you want to delete this district `}</Text>
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
      notify('Success', 'District deleted successfully');
    } catch (err) {
      notify('Error', 'Errors in deleting district.');
    }
  };

  const openEditModal = (id) => {
    logger.log(id);
    setIsModalOpen(true);
    setRegionId(id);
    setMode('detail');
  };

  return (
    <>
      <Relation
        config={relationConfig}
        data={isSuccess ? district.items : []}
        showPopUp={true}
        openDeleteModal={openDeleteModal}
        openEditModal={openEditModal}
        collapsed={false}
      />
      <Modal title="District" opened={isModalOpen} onClose={handleCloseModal}>
        <DistrictForm
          mode={mode}
          handleCloseModal={handleCloseModal}
          regionId={regionId}
        />
      </Modal>
    </>
  );
};

export default AddDistrict;
