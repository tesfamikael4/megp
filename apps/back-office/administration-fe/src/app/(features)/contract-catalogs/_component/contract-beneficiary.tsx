'use client';
import React, { useEffect, useState } from 'react';
import { ActionIcon, Button, Group, Modal, Text } from '@mantine/core';
import SelectOrganization from './select-organization';
import { useParams } from 'next/navigation';
import {
  useAssignContractBeneficiaryMutation,
  useLazyGetContractBeneficiaryQuery,
  useDeleteContractBeneficiaryMutation,
} from '@/store/api/contract-catalog/contract-catalog.api';
import { ExpandableTable, Section, notify } from '@megp/core-fe';
import { IconDeviceFloppy, IconPlus, IconTrash } from '@tabler/icons-react';
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
  const [remove] = useDeleteContractBeneficiaryMutation();

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

  const handleRemove = async (record) => {
    try {
      await remove(record.beneficiaryId).unwrap();
      notify('Success', 'Beneficiary deleted successfully');
    } catch (err) {
      notify('Error', 'Failed to delete beneficiary');
    }
  };

  useEffect(() => {
    getBeneficiary(id?.toString());
  }, [id]);

  useEffect(() => {
    if (isSuccess) {
      const beneficiary = ContractBeneficiary.items.map((item) => {
        return { ...item.organization, beneficiaryId: item.id };
      });
      setCurrentAssigned(beneficiary);
    }
  }, [ContractBeneficiary, isSuccess]);

  const config = {
    isExpandable: true,
    columns: [
      {
        title: 'Name',
        accessor: 'name',
        // width: 150,
      },
      {
        accessor: 'shortName',
      },
      {
        title: '',
        accessor: 'action',
        render: (record) => (
          <Group>
            <ActionIcon
              variant="light"
              onClick={(e) => {
                e.stopPropagation();
                handleRemove(record);
              }}
              className="ml-auto"
            >
              <IconTrash size={14} />
            </ActionIcon>
          </Group>
        ),
      },
    ],
    expandedRowContent: (beneficiaryRecord) => {
      return <ContractAllocatedItem beneficiary={beneficiaryRecord} />;
    },
  };

  return (
    <>
      <Section
        collapsible={false}
        title={'Beneficiaries'}
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
        <Group>
          <Button onClick={handleSave} loading={isSaving} className="ml-auto">
            <IconDeviceFloppy size={14} /> Save
          </Button>
        </Group>
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
