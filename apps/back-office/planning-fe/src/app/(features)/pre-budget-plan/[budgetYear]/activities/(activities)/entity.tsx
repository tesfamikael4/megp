'use client';
import { EntityConfig, EntityLayout } from '@megp/entity';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { Button } from '@mantine/core';
import { IconGardenCart } from '@tabler/icons-react';
import { PreBudgetPlanActivities } from '@/models/pre-budget-plan-activities';
import {
  useLazyListByAppIdQuery,
  useListByAppIdQuery,
} from './_api/activities.api';

export function Entity({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { budgetYear } = useParams();
  const [listById, { data: list }] = useLazyListByAppIdQuery();

  const config: EntityConfig<any> = useMemo(() => {
    return {
      basePath: `/pre-budget-plan/${budgetYear}/activities`,
      mode: 'list',
      entity: 'activities',
      primaryKey: 'name',
      title: 'Pre-Budget Plan Activities',
      onAdd: () => {
        router.push(`/pre-budget-plan/${budgetYear}/activities/new`);
      },
      onDetail: (selected: PreBudgetPlanActivities) => {
        router.push(`/pre-budget-plan/${budgetYear}/activities/${selected.id}`);
      },

      selectable: true,
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
          id: 'procurementReference',
          header: '#Ref',
          accessorKey: 'procurementReference',
          cell: (info) => info.getValue(),
          meta: {
            widget: 'expand',
          },
        },

        {
          id: 'procurementType',
          header: 'Procurement Type',
          accessorKey: 'procurementType',
          cell: (info) => info.getValue(),
          meta: {
            widget: 'expand',
          },
        },
        {
          id: 'procurementMethod',
          header: 'Procurement Method',
          accessorKey: 'procurementMethod',
          cell: (info) => info.getValue(),
          meta: {
            widget: 'expand',
          },
        },
        {
          id: 'preference',
          header: 'Preference',
          accessorKey: 'preference',
          cell: (info) => info.getValue(),
          meta: {
            widget: 'expand',
          },
        },
        {
          id: 'fundingSource',
          header: 'Funding Source',
          accessorKey: 'fundingSource',
          cell: (info) => info.getValue(),
          meta: {
            widget: 'expand',
          },
        },
        {
          id: 'totalEstimatedAmount',
          header: 'Total Estimated Amount',
          accessorKey: 'totalEstimatedAmount',
          cell: (info) => info.getValue(),
          meta: {
            widget: 'expand',
          },
        },
        {
          id: 'items',
          header: '',
          accessorKey: 'items',
          cell: ({ row: { original } }: any) => {
            return (
              <Button
                onClick={() =>
                  router.push(
                    `/pre-budget-plan/${budgetYear}/activities/items/${original.id}`,
                  )
                }
              >
                <IconGardenCart /> Items
              </Button>
            );
          },
        },
      ],
      // searchable: true,
      pagination: true,
    };
  }, [router]);

  const pathname = usePathname();

  const mode =
    pathname === `/pre-budget-plan/${budgetYear}/activities`
      ? 'list'
      : pathname === `/pre-budget-plan/${budgetYear}/activities/new`
      ? 'new'
      : 'detail';

  useEffect(() => {
    listById(budgetYear as string);
  }, [budgetYear, listById]);

  return (
    <EntityLayout
      mode={mode}
      config={config}
      data={list?.items ?? []}
      detail={children}
    />
  );
}
