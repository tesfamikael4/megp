'use client';
import { EntityConfig, EntityLayout } from '@megp/entity';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { Button, Flex, NumberInput, Select, Text } from '@mantine/core';
import { IconGardenCart, IconPencil } from '@tabler/icons-react';
import { PreBudgetPlanActivities } from '@/models/pre-budget-plan-activities';
import { logger } from '@megp/core-fe';

export function Entity({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { budgetYear, activityId } = useParams();
  const data = [
    {
      id: '6ce66c51-7258-45cb-9e63-6840b63bdfe5',
      description: 'Alfreds Futterkiste',
      itemCode: '0074321',
      currency: 'USD',
      unitPrice: '4554.25',
      quantity: 30,
      UoM: 'Peace',
      totalEstimatedAmount: 'USD 1,442.32',
    },
    {
      id: '04a426b8-d93b-45aa-b0df-0b4ad3fc9d30',
      description: 'Antonio Moreno Taqueria',
      itemCode: '5553932',
      currency: 'USD',
      unitPrice: '4554.25',
      quantity: 30,
      UoM: 'Peace',
      totalEstimatedAmount: 'USD 15,889.78',
    },
    {
      id: '8bbdf119-db4c-44de-8c56-476bd0de2e6a',
      description: 'Around the horn',
      itemCode: '5557788',
      currency: 'USD',
      unitPrice: '4554.25',
      quantity: 30,
      UoM: 'Peace',
      totalEstimatedAmount: 'USD 248,458.55',
    },
    {
      id: '88e5ed05-23ec-4794-9322-d3a297b64b3e',
      description: 'Berglunds snabbkop',
      itemCode: '123465',
      currency: 'USD',
      unitPrice: '4554.25',
      quantity: 30,
      UoM: 'Peace',
      totalEstimatedAmount: 'USD 1,281,458.00',
    },
  ];

  const EstimatedPrice = ({ cell }: any) => {
    const [isEditorOpened, setIsEditorOpened] = useState(false);
    return (
      <>
        <Flex gap="sm">
          <Text>{cell.currency}</Text>
          {!isEditorOpened && (
            <>
              <Text>{cell.unitPrice}</Text>
              <IconPencil onClick={() => setIsEditorOpened(true)} />
            </>
          )}
          {isEditorOpened && (
            <NumberInput
              value={cell.unitPrice}
              onChange={(data) => logger.log(data)}
            />
          )}
        </Flex>
      </>
    );
  };

  const Quantity = ({ cell }: any) => {
    const [isEditorOpened, setIsEditorOpened] = useState(false);
    return (
      <>
        <Flex gap="sm">
          {!isEditorOpened && (
            <>
              <Text>{cell.quantity}</Text>
              <Text>{cell.UoM}</Text>
              <IconPencil onClick={() => setIsEditorOpened(true)} />
            </>
          )}
          {isEditorOpened && (
            <>
              <NumberInput
                value={cell.quantity}
                onChange={(data) => logger.log(data)}
              />
              <Select value={cell.UoM} data={['Peace', 'Kg']} />
            </>
          )}
        </Flex>
      </>
    );
  };

  const config: EntityConfig<any> = useMemo(() => {
    return {
      basePath: `/pre-budget-plan/${budgetYear}/activities/items/${activityId}`,
      mode: 'list',
      entity: 'activities',
      primaryKey: 'description',
      title: 'Items: Alfreds Futterkiste',
      onAdd: () => {
        router.push(
          `/pre-budget-plan/${budgetYear}/activities/items/${activityId}/new`,
        );
      },
      onDetail: (selected: PreBudgetPlanActivities) => {
        router.push(
          `/pre-budget-plan/${budgetYear}/activities/items/${activityId}/${selected.id}`,
        );
      },

      selectable: true,
      columns: [
        {
          id: 'name',
          header: 'Description',
          accessorKey: 'description',
          cell: (info) => info.getValue(),
          meta: {
            widget: 'primary',
          },
        },
        {
          id: 'itemCode',
          header: 'Code',
          accessorKey: 'itemCode',
          cell: (info) => info.getValue(),
          meta: {
            widget: 'expand',
          },
        },
        {
          id: 'price',
          header: 'Estimated Unit Price',
          accessorKey: 'price',
          cell: ({ row: { original } }: any) => (
            <EstimatedPrice cell={original} />
          ),
          meta: {
            widget: 'expand',
          },
        },
        {
          id: 'quantity',
          header: 'Quantity',
          accessorKey: 'quantity',
          cell: ({ row: { original } }: any) => <Quantity cell={original} />,
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
      ],
      searchable: true,
      pagination: true,
    };
  }, [router]);

  const pathname = usePathname();

  const mode =
    pathname === `/pre-budget-plan/${budgetYear}/activities/items/${activityId}`
      ? 'list'
      : pathname ===
        `/pre-budget-plan/${budgetYear}/activities/items/${activityId}/new`
      ? 'new'
      : 'detail';

  return (
    <EntityLayout mode={mode} config={config} data={data} detail={children} />
  );
}
