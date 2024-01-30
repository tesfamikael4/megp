import React, { useEffect, useState } from 'react';
import { Modal } from '@mantine/core';
import { CollectionQuery, Relation, RelationConfig } from '@megp/entity';
import {
  useRelationMutation,
  useLazySecondRelationQuery,
} from '../../_api/user-role.api';
import { useParams } from 'next/navigation';
import { useLazyRoleToAssignQuery } from '../../_api/custom.api';
import { Role } from '@/models/role';
import { notify } from '@megp/core-fe';
import { useAuth } from '@megp/auth';

const AddEntityModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAssigned, setCurrentAssigned] = useState<Role[]>([]);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(true);
  const { id } = useParams();
  const { organizationId } = useAuth();

  const [assign, { isLoading: isSaving }] = useRelationMutation();

  const [trigger, { data: roles, isSuccess, isLoading }] =
    useLazySecondRelationQuery();
  const [triggerData, { data, isFetching }] = useLazyRoleToAssignQuery();

  const relationConfig: RelationConfig<Role> = {
    title: 'Roles Assignment',
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
        role: roles,
      };

      try {
        id && (await assign(data).unwrap());
        notify('Success', 'Role has been assigned to user successfully.');
      } catch (err) {
        notify('Error', 'Sorry, an error encountered while assigning role.');
      }
    },
    onAdd: () => {
      setIsModalOpen(true);
    },
  };
  const addConfig: RelationConfig<Role> = {
    title: 'Roles assignment',
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
        roles ? roles.items.map((role: any) => role.role) : [],
      );
    }
  }, [roles, isSuccess]);

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
        title="Role assignment"
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
