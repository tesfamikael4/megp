import { ExpandableTable } from '@/app/(features)/_components/expandable-table';
import { Box, Button, Divider, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Section } from '@megp/core-fe';
import { IconX } from '@tabler/icons-react';
import { useParams } from 'next/navigation';
import React from 'react';
import { useLazyListByIdQuery } from '../../_api/tender/personnel-list.api';
import PersonnelFormDetail from './personnel-form-detail';

export default function TenderPersonnelList() {
  const { id } = useParams();
  const [opened, { open, close }] = useDisclosure(false);

  const [trigger, { data, isLoading }] = useLazyListByIdQuery();

  const config = {
    columns: [
      {
        accessor: 'position',
        title: 'Position',
        sortable: true,
      },
      { accessor: 'evaluated', title: 'Evaluated', sortable: true },
      {
        accessor: 'order',
        title: 'Order',
        sortable: true,
      },
    ],
    isExpandable: false,
    isSearchable: true,
    isLoading: isLoading,
    primaryColumn: 'position',
  };
  const onRequestChange = (request: any) => {
    trigger({
      id: id.toString() ?? '',
      ...request,
    });
  };

  const onReturnFunction = () => {
    trigger({
      id: id.toString() ?? '',
      collectionQuery: {},
    });
    close();
  };

  return (
    <Section
      title="Personnel List"
      collapsible={true}
      defaultCollapsed={true}
      action={<Button onClick={open}>Add Personnel</Button>}
      className="capitalize my-2"
    >
      <ExpandableTable
        config={config}
        data={data?.items ?? []}
        total={data?.total ?? 0}
        onRequestChange={onRequestChange}
      />

      <Modal
        opened={opened}
        size={'40%'}
        onClose={close}
        withCloseButton={false}
      >
        <div className="flex justify-between">
          <h2 className="font-medium text-lg capitalize">Create A Personnel</h2>
          <IconX onClick={close} />
        </div>
        <Divider mt={'md'} mb={'md'} />
        <Box className="bg-white rounded shadow-sm mx-2">
          <PersonnelFormDetail returnFunction={onReturnFunction} />
        </Box>
      </Modal>
    </Section>
  );
}
