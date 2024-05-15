'use client';
import React, { useEffect, useState } from 'react';
import { Button, Group, Modal, Text } from '@mantine/core';
import SelectOrganization from './select-organization';
import { useParams } from 'next/navigation';
import {
  useAssignContractBeneficiaryMutation,
  useLazyGetContractBeneficiaryQuery,
} from '@/store/api/contract-catalog/contract-catalog.api';
import { ExpandableTable, Section, notify } from '@megp/core-fe';
import { IconDeviceFloppy, IconPlus } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import ContractAllocatedItem from './allocated-item';

const ContractBeneficiary = () => {
  const [currentAssigned, setCurrentAssigned] = useState<any[]>([]);
  const [opened, { open, close }] = useDisclosure(false);

  const { id } = useParams();

  const [assign, { isLoading: isSaving }] =
    useAssignContractBeneficiaryMutation();
  const [getBeneficiary, { data: ContractBeneficiary, isSuccess }] =
    useLazyGetContractBeneficiaryQuery();

  const handleCloseModal = () => {
    close();
  };

  const handleSave = async () => {
    const org = currentAssigned.map((item: any) => {
      return {
        id: item?.id,
        name: item?.name,
        shortName: item?.shortName,
        code: item?.code,
      };
    });
    try {
      await assign({
        organizations: org,
        contractCatalogId: id,
      }).unwrap();

      notify('Success', 'Beneficiary assigned successfully');
    } catch (err) {
      notify('Error', 'Failed to assign beneficiary');
    }
  };
  useEffect(() => {
    getBeneficiary(id?.toString());
  }, [id]);

  useEffect(() => {
    if (isSuccess) {
      const beneficiary = ContractBeneficiary.items.map(
        (item) => item.organization,
      );
      setCurrentAssigned(beneficiary);
    }
  }, [ContractBeneficiary, isSuccess]);

  const config = {
    isExpandable: true,
    columns: [
      {
        title: 'Name',
        accessor: 'name',
        width: 150,
      },
      {
        accessor: 'shortName',
        width: 100,
      },
    ],
    expandedRowContent: (requisition) => {
      return <ContractAllocatedItem />;
    },
  };

  return (
    <>
      <Section
        collapsible={false}
        title={'Add Beneficiary'}
        action={
          <Group justify="end">
            <Button onClick={open}>
              <IconPlus size={18} /> Add
            </Button>
          </Group>
        }
      >
        <ExpandableTable
          config={config}
          data={currentAssigned}
          total={currentAssigned.length}
        />

        <Button onClick={handleSave} loading={isSaving}>
          <IconDeviceFloppy size={14} /> Save
        </Button>
        <Modal
          title={<Text fw={'bold'}>Organization Assignment</Text>}
          opened={opened}
          onClose={handleCloseModal}
          size={'xl'}
        >
          <SelectOrganization
            opened={opened}
            close={handleCloseModal}
            setSelectedOrg={setCurrentAssigned}
            selectedOrg={currentAssigned}
            mode={'assign'}
          />
        </Modal>
      </Section>
    </>
  );
};

export default ContractBeneficiary;
