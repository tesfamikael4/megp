'use client';

import React, { useEffect, useState } from 'react';
import { Modal } from '@mantine/core';
import { CollectionQuery, Relation, RelationConfig } from '@megp/entity';
import { useLazyListQuery } from '@/app/(features)/organizations/_api/budget-categories.api';

import { useParams } from 'next/navigation';
import { TableConfig, logger, notify } from '@megp/core-fe';
import { useAuth } from '@megp/auth';
import { BudgetCategory } from '@/models/budget-category';
import {
  useAssignBudgetToOrganizationMutation,
  useLazyGetBudgetCategoriesQuery,
} from '@/store/api/budget-category/budge-category.api';
import { CollectionSelector } from './collection-selector';

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
    onAdd: () => {
      setIsModalOpen(true);
    },
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (!isCollapsed) {
      trigger({ id: id?.toString() });
    }
  }, [id, isCollapsed, trigger]);

  useEffect(() => {
    if (isSuccess) {
      setCurrentAssigned(
        organizationBugetCategories
          ? organizationBugetCategories.map(
              (budgetCate: any) => budgetCate.budgetCategory,
            )
          : [],
      );
    }
  }, [isSuccess, organizationBugetCategories]);

  useEffect(() => {
    triggerBudgetCategory(undefined);
  }, [isCollapsed, triggerBudgetCategory, user?.organization?.id]);

  logger.log(data);

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

  return (
    <>
      <Relation
        config={relationConfig}
        data={currentAssigned}
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
            setCurrentAssigned([data]);
            logger.log({ data });
            handleCloseModal();
          }}
          onRequestChange={onRequestChange}
        />
      </Modal>
    </>
  );
};

export default AddEntityModal;
