import { Box, Button, Divider, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { ExpandableTable, Section, logger, notify } from '@megp/core-fe';
import { IconDeviceFloppy, IconX } from '@tabler/icons-react';
import { useParams, useSearchParams } from 'next/navigation';
import React, { useContext, useEffect } from 'react';
import PersonnelCapabilitiesFormDetail from './personnel-capabilities-form-detail';
import { useLazyGetPersonnelQuery } from '@/app/(features)/tender-workspace/_api/bid-attribute-datas';
import { PrepareBidContext } from '@/contexts/prepare-bid.context';
import {
  useLazyGetLotBidResponseQuery,
  useSaveLotBidResponseMutation,
} from '@/app/(features)/tender-workspace/_api/lot-bid-response.api';

const PersonnelCapabilities = () => {
  const { tenderId } = useParams();
  const [opened, { open, close }] = useDisclosure(false);
  const prepareBidContext = useContext(PrepareBidContext);
  const [triggerGetExperts, { data: experts, isLoading: isSubmissionLoading }] =
    useLazyGetLotBidResponseQuery();
  const searchParams = useSearchParams();
  const [trigger, { data, isLoading }] = useLazyGetPersonnelQuery();
  const [saveChanges, { isLoading: isSaving }] =
    useSaveLotBidResponseMutation();
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

  useEffect(() => {
    if (searchParams.get('lot') && prepareBidContext?.password) {
      triggerGetExperts({
        lotId: searchParams.get('lot'),
        documentType: prepareBidContext?.documentType,
        key: 'experts',
        password: prepareBidContext?.password,
      });
    }
  }, [prepareBidContext, searchParams, triggerGetExperts]);
  const handleSaveChanges = (data) => {
    saveChanges({
      lotId: searchParams.get('lot'),
      key: 'experts',
      documentType: prepareBidContext?.documentType,
      value: {
        value: [...(experts?.value ?? []), data],
      },
      password: prepareBidContext?.password,
    })
      .unwrap()
      .then(() => {
        notify('Success', 'lot value saved successfully');
        close();
      })
      .catch(() => {
        notify('Error', 'error while saving');
      });
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
        data={experts ? experts.value : data?.items ?? []}
        total={data?.total ?? 0}
        onRequestChange={onRequestChange}
      />
      {/* <Box className="flex justify-end mt-4">
        <Button loading={isSaving} onClick={handleSaveChanges}>
          <IconDeviceFloppy size={14} /> Save Changes
        </Button>
      </Box> */}
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
          <PersonnelCapabilitiesFormDetail returnFunction={handleSaveChanges} />
        </Box>
      </Modal>
    </Section>
  );
};

export default PersonnelCapabilities;
