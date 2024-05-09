import { Box, Button, Divider, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { ExpandableTable, Section, logger } from '@megp/core-fe';
import { IconX } from '@tabler/icons-react';
import { useParams } from 'next/navigation';
import React from 'react';
import PersonnelCapabilitiesFormDetail from './personnel-capabilities-form-detail';
import { useLazyGetPersonnelQuery } from '@/app/(features)/tender-workspace/_api/bid-attribute-datas';

const PersonnelCapabilities = () => {
  const { tenderId } = useParams();
  const [opened, { open, close }] = useDisclosure(false);

  const [trigger, { data, isLoading }] = useLazyGetPersonnelQuery();

  const config = {
    columns: [
      {
        accessor: 'position',
        title: 'Position',
      },
      { accessor: 'name', title: 'Name of candidate' },
      {
        accessor: 'nationality',
        title: 'Nationality',
      },
    ],
    isExpandable: false,
    isSearchable: true,
    isLoading: isLoading,
    primaryColumn: 'position',
  };
  const onRequestChange = (request: any) => {
    trigger(tenderId.toString());
  };

  const onReturnFunction = (data) => {
    logger.log(data);
    close();
  };

  return (
    <Section
      title="Personnel Capabilities Key Personnel"
      defaultCollapsed={true}
      collapsible={true}
      action={<Button onClick={open}>Add</Button>}
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
          <PersonnelCapabilitiesFormDetail returnFunction={onReturnFunction} />
        </Box>
      </Modal>
    </Section>
  );
};

export default PersonnelCapabilities;
