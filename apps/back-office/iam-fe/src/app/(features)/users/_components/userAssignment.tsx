import React, { useEffect, useState } from 'react';
import { Modal, Stack } from '@mantine/core';
import { Relation, RelationConfig } from '@megp/entity';
import { Mandate } from '@/models/mandate';
import { notifications } from '@mantine/notifications';
import { logger } from '@megp/core-fe';
import {
  useAssignRoleToUserMutation,
  useAssignUnitToUserMutation,
  useGetRoleByUserIdQuery,
  useGetUnitByUserIdQuery,
} from '../_api/userAssignment.api';
import { useParams } from 'next/navigation';
import { useListQuery } from '../../units/_api/unit.api';

const AddEntityModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAssignedUnits, setCurrentAssignedUnits] = useState<any[]>([]);
  const { id } = useParams();
  const [assignUnit, { isSuccess: assigned }] = useAssignUnitToUserMutation();

  const { data: userUnits, isSuccess: userUnitSucced } =
    useGetUnitByUserIdQuery(id?.toString());
  const { data: units, isSuccess } = useListQuery();
  logger.log(units);

  const relationConfig: RelationConfig<Mandate> = {
    title: 'Units',
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
      const data = currentAssignedUnits.map((item) => {
        return {
          userId: id?.toString(),
          unitId: item?.id,
          unitName: item?.name,
        };
      });
      logger.log(id);
      try {
        id && (await assignUnit({ data, id: id?.toString() }).unwrap());

        notifications.show({
          message: 'unit has been assigned to user successfully.',
          title: 'Sucess',
          color: 'green',
        });
      } catch (err) {
        notifications.show({
          message: 'Sorry, an error encountered while assigining unit.',
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
    title: 'Unit',
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
      logger.log(selected);
      setCurrentAssignedUnits(selected);
      setIsModalOpen(false);
    },

    selectable: true,
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Close the modal
  };
  logger.log(currentAssignedUnits);

  useEffect(() => {
    if (userUnitSucced) {
      const data = userUnits?.userUnits.map((unit: any) => unit?.unit);
      setCurrentAssignedUnits(data);
    }
  }, [assigned, isSuccess, userUnitSucced, userUnits?.userUnits]);
  logger.log(units);
  // const [selected, setSelected] = useState({});
  logger.log('s', currentAssignedUnits);
  return (
    <>
      <Relation config={relationConfig} data={currentAssignedUnits} />
      <Modal title="Unit" opened={isModalOpen} onClose={handleCloseModal}>
        <Relation
          config={addConfig}
          mode="modal"
          data={units ? units.items : []}
          currentSelected={currentAssignedUnits}
        />
      </Modal>
    </>
  );
};

export default AddEntityModal;
