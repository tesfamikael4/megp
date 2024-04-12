import React, { useState } from 'react';
import { Modal } from '@mantine/core';
import { Text } from '@mantine/core';
import { Relation, RelationConfig } from '@megp/entity';
import { useParams } from 'next/navigation';
import { modals } from '@mantine/modals';
import { logger } from '@megp/core-fe';
import {
  useListByAppIdQuery as useListRegionId,
  useDeleteMutation,
} from '../_api/district.api';
import { District } from '@/models/district';
import { DistrictForm } from './district';
import { notifications } from '@mantine/notifications';

const AddDistrict = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mode, setMode] = useState<'new' | 'detail'>('new');
  const [districtId, setDistrictId] = useState('');
  const { id } = useParams();

  const { data: district, isSuccess } = useListRegionId(id?.toString());

  const [remove] = useDeleteMutation();

  const relationConfig: RelationConfig<District> = {
    title: 'Districts ',
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
        <Text size="sm">{`Are you sure you want to delete this District `}</Text>
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
        message: 'District deleted successfully',
        title: 'Success',
        color: 'green',
      });
    } catch (err) {
      notifications.show({
        message: 'Error in deleting district.',
        title: 'Error',
        color: 'red',
      });
    }
  };

  const openEditModal = (id) => {
    logger.log(id);
    setIsModalOpen(true);
    setDistrictId(id);
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
        total={district?.items.length}
      />
      <Modal
        title={mode === 'new' ? 'New District' : 'Update District'}
        opened={isModalOpen}
        onClose={handleCloseModal}
      >
        <DistrictForm
          mode={mode}
          handleCloseModal={handleCloseModal}
          districtId={districtId}
        />
      </Modal>
    </>
  );
};

export default AddDistrict;
