import React, { useState } from 'react';
import { Modal } from '@mantine/core';
import { Text } from '@mantine/core';
import { Relation, RelationConfig } from '@megp/entity';
import { useListByIdQuery, useDeleteMutation } from '../_api/permission.api';
import { useParams } from 'next/navigation';
import { Permission } from '@/models/permission';
import { PermissionForm } from './permission-form';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { logger } from '@megp/core-fe';

const AddPermisionModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mode, setMode] = useState<'new' | 'detail'>('new');
  const [unitId, setUnitId] = useState('');
  const { id } = useParams();

  const { data: applicationPermission, isSuccess } = useListByIdQuery(
    id?.toString(),
  );

  const [remove] = useDeleteMutation();

  const relationConfig: RelationConfig<Permission> = {
    title: 'Application Permission',
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
        <Text size="sm">{`Are you sure you want to delete this permission `}</Text>
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
        message: 'Permission deleted successfully',
        title: 'Success',
      });
    } catch (err) {
      notifications.show({
        message: 'Errors in deleting Permission.',
        title: 'Error',
        color: 'red',
      });
    }
  };

  const openEditModal = (id) => {
    logger.log(id);
    setIsModalOpen(true);
    setUnitId(id);
    setMode('detail');
  };

  return (
    <>
      <Relation
        config={relationConfig}
        data={isSuccess ? applicationPermission.items : []}
        showPopUp={true}
        openDeleteModal={openDeleteModal}
        openEditModal={openEditModal}
        collapsed={false}
      />
      <Modal title="Permission" opened={isModalOpen} onClose={handleCloseModal}>
        <PermissionForm
          mode={mode}
          handleCloseModal={handleCloseModal}
          unitId={unitId}
        />
      </Modal>
    </>
  );
};

export default AddPermisionModal;
