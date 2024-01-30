import React, { useEffect, useState } from 'react';
import { Modal, Button } from '@mantine/core';
import { RelationConfig } from '@megp/entity';
import { useLazyListByIdQuery } from '../_api/custom.api';
import { useParams } from 'next/navigation';
import { FormDetail } from './form';
import { Section, Table, logger } from '@megp/core-fe';
import { IconPlus } from '@tabler/icons-react';
import Invitation from './action';
import { User } from '@/models/user/user';

const AddOa = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(true);

  const { id } = useParams();

  const [trigger, { data }] = useLazyListByIdQuery();

  const relationConfig: RelationConfig<User> = {
    title: 'organization administrator',
    columns: [
      {
        id: 'name',
        header: 'Name',
        accessorKey: 'firstName ',
        cell: (info) => info.getValue(),
        meta: {
          widget: 'primary',
        },
      },
      {
        id: 'email',
        header: 'Email',
        accessorKey: 'email',
        cell: (info) => info.getValue(),
      },
      {
        id: 'action',
        header: 'Actions',
        accessorKey: 'action',
        cell: ({ row }) => <Invitation user={row?.original} />,
        meta: {
          widget: 'action',
        },
      },
    ],
    pagination: true,

    onAdd: () => {
      setIsModalOpen(true);
    },
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    !isCollapsed && trigger(id?.toString());
  }, [id, trigger, isModalOpen, isCollapsed]);

  return (
    <>
      <Section
        title={'Manage organization administrator'}
        defaultCollapsed={true}
        setIsCollapsed={setIsCollapsed}
        action={
          <Button
            onClick={() => setIsModalOpen(true)}
            leftSection={<IconPlus size={16} stroke={2.2} />}
          >
            Add
          </Button>
        }
      >
        <Table config={relationConfig} data={data?.items ?? []}></Table>
        <Modal
          title={'Add user'}
          opened={isModalOpen}
          onClose={handleCloseModal}
          size={'lg'}
        >
          <FormDetail mode="new" handleCloseModal={handleCloseModal} />
        </Modal>
      </Section>
    </>
  );
};

export default AddOa;
