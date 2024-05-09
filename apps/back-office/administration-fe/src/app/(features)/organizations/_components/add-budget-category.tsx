'use client';

import { Button, Group, Modal } from '@mantine/core';
import { CollectionQuery, Relation, RelationConfig } from '@megp/entity';
import { useEffect, useState } from 'react';

import { BudgetCategory } from '@/models/budget-category';
import {
  useAssignBudgetToOrganizationMutation,
  useLazyGetBudgetCategoriesQuery,
} from '@/store/api/budget-category/budge-category.api';
import { useDisclosure } from '@mantine/hooks';
import { ExpandableTable, ExpandableTableConfig, notify } from '@megp/core-fe';
import { useParams } from 'next/navigation';
import { useLazyListQuery } from '../../lookup/budget-category/_api/budget-category.api';

const AddEntityModal = () => {
  const [opened, { close, open }] = useDisclosure(false);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(true);
  const [currentAssigned, setCurrentAssigned] = useState<any[]>([]);

  const { id } = useParams();

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

    disableMultiSelect: true,
    selectable: true,
    pagination: true,

    onAdd: () => {
      open();
    },
  };

  useEffect(() => {
    if (!isCollapsed) {
      trigger({ id: id?.toString() });
    }
  }, [id, isCollapsed, trigger]);

  useEffect(() => {
    if (isSuccess) {
      const cat = organizationBugetCategories
        ? organizationBugetCategories.map(
            (budgetCate: any) => budgetCate.budgetCategory,
          )
        : [];
      setCurrentAssigned(cat.filter((item) => item !== null));
    }
  }, [isSuccess, organizationBugetCategories]);

  const onRequestChange = (request: CollectionQuery) => {
    triggerBudgetCategory(request);
  };

  const config: ExpandableTableConfig = {
    isSearchable: true,
    primaryColumn: 'name',
    disableMultiSelect: true,
    selectedItems: currentAssigned,
    setSelectedItems: (data) => {
      const temp = data.filter((d) => !currentAssigned.includes(d));
      setCurrentAssigned(temp);
    },

    columns: [
      {
        title: 'Name',
        accessor: 'name',
      },
    ],
  };

  // logger.log(currentAssigned);

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
        opened={opened}
        onClose={close}
        size={'lg'}
      >
        <ExpandableTable
          data={data?.items ?? []}
          config={config}
          total={data?.total ?? 0}
          onRequestChange={onRequestChange}
        />
        <Group justify="end">
          <Button
            onClick={() => {
              if (Array.isArray(data)) {
                if (data.length > 0) {
                  setCurrentAssigned(data);
                  close();
                } else {
                  notify(
                    'Error',
                    'Please select at least one budget category.',
                  );
                }
              } else {
                close();
              }
            }}
          >
            Done
          </Button>
        </Group>
      </Modal>
    </>
  );
};

export default AddEntityModal;
