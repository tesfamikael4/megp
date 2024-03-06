import React, { useEffect, useState } from 'react';
import { Modal, Text } from '@mantine/core';
import { CollectionQuery, Relation, RelationConfig } from '@megp/entity';

import {
  useRelationMutation,
  useLazySecondRelationQuery,
} from '../../_api//user-role-system';
import { useParams } from 'next/navigation';
import { useLazyListByIdQuery } from '../../../(features)/system-role/_api/role.api';
import { Role } from '@/models/role';
import { notify } from '@megp/core-fe';
import { useAuth } from '@megp/auth';

const AddSystemRole = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAssigned, setCurrentAssigned] = useState<Role[]>([]);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(true);
  const { id } = useParams();
  const { organizationId } = useAuth();

  const [assign, { isLoading: isSaving }] = useRelationMutation();

  const [trigger, { data: systemRoles, isSuccess, isLoading }] =
    useLazySecondRelationQuery();
  const [triggerData, { data, isFetching }] = useLazyListByIdQuery();

  const relationConfig: RelationConfig<Role> = {
    title: 'System Roles Assignment',
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
      const roles = selected.map((item) => `${item.id}`);
      const data = {
        userId: id?.toString(),
        roleSystem: roles,
      };

      try {
        id && (await assign(data).unwrap());
        notify(
          'Success',
          'System role has been assigned to user successfully.',
        );
      } catch (err) {
        notify(
          'Error',
          'Sorry, an error encountered while assigning system role.',
        );
      }
    },
    onAdd: () => {
      setIsModalOpen(true);
    },
  };
  const addConfig: RelationConfig<Role> = {
    title: 'System Roles Assignment',
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
    sortable: true,
    searchable: true,
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
        systemRoles
          ? systemRoles.items.map((role: any) => role.roleSystem)
          : [],
      );
    }
  }, [isSuccess, systemRoles]);

  const onRequestChange = (request: CollectionQuery) => {
    organizationId !== undefined &&
      triggerData({ id: organizationId, collectionQuery: request });
  };

  return (
    <>
      <Relation
        config={relationConfig}
        data={currentAssigned}
        isSaving={isSaving}
        isLoading={isLoading}
        setIsCollapsed={setIsCollapsed}
      />
      <Modal
        title={<Text fw={'bold'}>System Role Assignment</Text>}
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

export default AddSystemRole;
