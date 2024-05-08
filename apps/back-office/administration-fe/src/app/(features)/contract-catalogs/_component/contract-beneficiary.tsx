import React, { useEffect, useState } from 'react';
import { Modal, Text } from '@mantine/core';
import { Relation, RelationConfig } from '@megp/entity';
import SelectOrganization from './select-organization';
import { useParams } from 'next/navigation';
import {
  useAssignContractBeneficiaryMutation,
  useLazyGetContractBeneficiaryQuery,
} from '@/store/api/contract-catalog/budge-category.api';
import { notify } from '@megp/core-fe';
import { Organization } from '@/models/organization';

const ContractBeneficiary = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAssigned, setCurrentAssigned] = useState<any[]>([]);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(true);

  const { id } = useParams();

  const [assign, { isLoading: isSaving }] =
    useAssignContractBeneficiaryMutation();
  const [getBeneficiary, { data: ContractBeneficiary, isLoading, isSuccess }] =
    useLazyGetContractBeneficiaryQuery();

  const relationConfig: RelationConfig<Organization> = {
    title: 'Contract Beneficiary',
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
        id: 'shortName',
        header: 'Short Name',
        accessorKey: 'shortName',
        cell: (info) => info.getValue(),
      },
    ],
    onSave: async (selected) => {
      const org = selected.map((item: any) => {
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
        notify('Success', ' successfully assigned.');
      } catch (err) {
        notify('Error', 'Sorry, an error encountered while assigning.');
      }
    },
    onAdd: () => {
      setIsModalOpen(true);
    },
  };

  useEffect(() => {
    if (!isCollapsed && id) {
      getBeneficiary(id.toString());
    }
  }, [getBeneficiary, id, isCollapsed]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (isSuccess) {
      const beneficiary = ContractBeneficiary.items.map(
        (item) => item.organization,
      );
      setCurrentAssigned(beneficiary);
    }
  }, [ContractBeneficiary, isSuccess]);

  return (
    <>
      <Relation
        config={relationConfig}
        data={currentAssigned}
        setIsCollapsed={setIsCollapsed}
        isLoading={isLoading}
        isSaving={isSaving}
      />
      <Modal
        title={<Text fw={'bold'}>User Assignment</Text>}
        opened={isModalOpen}
        onClose={handleCloseModal}
        size={'xl'}
      >
        <SelectOrganization
          opened={isModalOpen}
          close={handleCloseModal}
          setSelectedOrg={setCurrentAssigned}
          selectedOrg={currentAssigned}
          mode={'assign'}
        />
      </Modal>
    </>
  );
};

export default ContractBeneficiary;
