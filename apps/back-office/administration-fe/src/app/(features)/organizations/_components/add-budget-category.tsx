'use client';

import React, { useEffect, useState } from 'react';
import { Modal } from '@mantine/core';
import { CollectionQuery, Relation, RelationConfig } from '@megp/entity';

import { useParams } from 'next/navigation';
import { TableConfig, logger, notify } from '@megp/core-fe';
import { useAuth } from '@megp/auth';
import { BudgetCategory } from '@/models/budget-category';
import {
  useAssignBudgetToOrganizationMutation,
  useLazyGetBudgetCategoriesQuery,
} from '@/store/api/budget-category/budge-category.api';
import { useLazyListQuery } from '../../lookup/budget-category/_api/budget-category.api';
import { CollectionSelector } from '../../_components/collection-selector';

const AddEntityModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(true);
  const [currentAssigned, setCurrentAssigned] = useState<any[]>([]);
  const { id } = useParams();

  const { user } = useAuth();

  const [assignBudgetCategory, { isLoading: isSaving }] =
    useAssignBudgetToOrganizationMutation({});

  const [triggerBudgetCategory, { data }] = useLazyListQuery();

  const [trigger, { data: organizationBugetCategories, isSuccess }] =
    useLazyGetBudgetCategoriesQuery();

  const relationConfig: RelationConfig<BudgetCategory> = {
    title: 'Budget Category',
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
      const bugetCategory = selected.map((item) => `${item.id}`);
      const data = {
        organizationId: id?.toString(),
        budgetCategoryId: bugetCategory,
      };

      try {
        await assignBudgetCategory(data).unwrap();
        notify(
          'Success',
          'Budget Category has been assigned to organization successfully.',
        );
      } catch (err) {
        notify(
          'Error',
          'Sorry, an error encountered while assigning Budget Category.',
        );
      }
    },
    searchable: true,
    disableMultiSelect: true,
    selectable: true,
    pagination: true,
    onAdd: () => {
      setIsModalOpen(true);
    },
  };
  logger.log(organizationBugetCategories);

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (!isCollapsed) {
      trigger({ id: id?.toString() });
    }
  }, [id, isCollapsed, trigger]);

  useEffect(() => {
    logger.log(organizationBugetCategories);
    if (isSuccess) {
      const cat = organizationBugetCategories
        ? organizationBugetCategories.map(
            (budgetCate: any) => budgetCate.budgetCategory,
          )
        : [];
      setCurrentAssigned(cat.filter((item) => item !== null));
    }
  }, [isSuccess, organizationBugetCategories]);

  useEffect(() => {
    triggerBudgetCategory(undefined);
  }, [isCollapsed, triggerBudgetCategory, user?.organization?.id]);

  logger.log(currentAssigned);

  const onRequestChange = (request: CollectionQuery) => {
    isModalOpen && id;
  };

  const config: TableConfig<any> = {
    columns: [
      {
        id: 'name',
        header: 'Name',
        accessorKey: 'name',
      },
    ],
  };
  logger.log(currentAssigned);

  return (
    <>
      <Relation
        config={relationConfig}
        data={currentAssigned ?? []}
        setIsCollapsed={setIsCollapsed}
        isSaving={isSaving}
      />
      <Modal
        title="Budget Category"
        opened={isModalOpen}
        onClose={handleCloseModal}
        size={'lg'}
      >
        <CollectionSelector
          data={data?.items ?? []}
          config={config}
          total={data?.total ?? 0}
          onDone={(data) => {
            if (Array.isArray(data)) {
              if (data.length > 0) {
                setCurrentAssigned(data);
                handleCloseModal();
              } else {
                notify('Error', 'Please select at least one budget category.');
              }
            } else {
              // If data is not an array, convert it to an array with a single item
              setCurrentAssigned([data]);
              handleCloseModal();
            }
          }}
          onRequestChange={onRequestChange}
        />
      </Modal>
    </>
  );
};

export default AddEntityModal;
