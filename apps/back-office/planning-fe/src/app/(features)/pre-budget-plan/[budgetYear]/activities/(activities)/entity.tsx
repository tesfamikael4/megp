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
  // const data = [
  //   {
  //     id: '6ce66c51-7258-45cb-9e63-6840b63bdfe5',
  //     name: 'Alfreds Futterkiste',
  //     ref: '030-0074321',
  //     preference: 'Maria Andres',
  //     procurementType: 'Buying',
  //     procurementMethod: 'Open',
  //     fundingSource: 'Loan',
  //     totalEstimatedAmount: 'USD 1,442.32',
  //   },
  //   {
  //     id: '04a426b8-d93b-45aa-b0df-0b4ad3fc9d30',
  //     name: 'Antonio Moreno Taqueria',
  //     ref: '(5) 555-3932',
  //     preference: 'Antonio Moreno',
  //     procurementType: 'Buying',
  //     procurementMethod: 'Open',
  //     fundingSource: 'IR',
  //     totalEstimatedAmount: 'USD 15,889.78',
  //   },
  //   {
  //     id: '8bbdf119-db4c-44de-8c56-476bd0de2e6a',
  //     name: 'Around the horn',
  //     ref: '(171) 555-7788',
  //     preference: 'Thomas Hardly',
  //     procurementType: 'Buying',
  //     procurementMethod: 'Limited',
  //     fundingSource: 'Treasury',
  //     totalEstimatedAmount: 'USD 248,458.55',
  //   },
  //   {
  //     id: '88e5ed05-23ec-4794-9322-d3a297b64b3e',
  //     name: 'Berglunds snabbkop',
  //     ref: '0921-123465',
  //     preference: 'Christina Berglunds',
  //     procurementType: 'Buying',
  //     procurementMethod: 'Selective',
  //     fundingSource: 'Treasury',
  //     totalEstimatedAmount: 'USD 1,281,458.00',
  //   },
  // ];

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
      searchable: true,
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
