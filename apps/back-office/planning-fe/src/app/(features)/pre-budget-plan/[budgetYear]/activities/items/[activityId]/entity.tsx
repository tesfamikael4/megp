'use client';
import { EntityConfig, EntityLayout } from '@megp/entity';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { Button, Flex, NumberInput, Select, Text } from '@mantine/core';
import { IconGardenCart, IconPencil } from '@tabler/icons-react';
import { PreBudgetPlanActivities } from '@/models/pre-budget-plan-activities';
import { logger } from '@megp/core-fe';
import { useLazyListByAppIdQuery } from './_api/items.api';
import { useDisclosure } from '@mantine/hooks';
import ItemSelector from './_components/item-selector';
import { useLazyGetUnitOfMeasurementsQuery } from '@/store/api/administration/administration.api';
import { useLazyReadQuery } from '../../(activities)/_api/activities.api';

export function Entity({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { budgetYear, activityId } = useParams();
  const [data, setData] = useState<any[]>([]);
  const [listById, { data: list, isSuccess }] = useLazyListByAppIdQuery();
  const [opened, { open, close }] = useDisclosure(false);
  const [getActivity, { data: activity }] = useLazyReadQuery();

  useEffect(() => {
    isSuccess && setData([...(list?.items ?? [])]);
  }, [list, isSuccess]);

  useEffect(() => {
    listById(activityId as string);
  }, [activityId]);
  useEffect(() => {
    getActivity(activityId as string);
  }, [activityId, getActivity]);

  const EstimatedPrice = ({
    getValue,
    row: { index, original },
    column: { id },
    table,
  }: any) => {
    const [isEditorOpened, setIsEditorOpened] = useState(false);
    const initialValue = getValue();
    const [value, setValue] = useState(initialValue);
    const onBlur = () => {
      setIsEditorOpened(false);

      setData((old) =>
        old.map((row, i) => {
          if (i === index) {
            return {
              ...old[index],
              [id]: value,
            };
          }
          return row;
        }),
      );
    };
    useEffect(() => {
      setValue(initialValue);
    }, [initialValue]);
    return (
      <>
        <Flex gap="sm">
          {!isEditorOpened && (
            <>
              <Text>{original?.currency}</Text>
              <Text>{original?.unitPrice}</Text>
              <IconPencil
                onClick={() => setIsEditorOpened(true)}
                className="ml-auto"
              />
            </>
          )}
          {isEditorOpened && (
            <NumberInput
              leftSection={original.currency}
              value={value}
              onChange={setValue}
              onBlur={onBlur}
            />
          )}
        </Flex>
      </>
    );
  };

  const Quantity = ({ cell }: any) => {
    const [isEditorOpened, setIsEditorOpened] = useState(false);
    const [getUoM, { data: uom }] = useLazyGetUnitOfMeasurementsQuery();

    const handleOnChange = (e) => {
      logger.log(data);
      const tempData: any[] = data.map((d) => {
        if (d != cell) return d;
        return { ...d, quantity: e };
      });
      setData([...tempData]);
    };

    useEffect(() => {
      isEditorOpened && getUoM(cell.measurement);
    }, [isEditorOpened]);
    return (
      <>
        <Flex gap="sm">
          {!isEditorOpened && (
            <>
              <Text>{cell.quantity}</Text>
              {/* <Text>{cell.uom}</Text> */}
              <IconPencil
                onClick={() => setIsEditorOpened(true)}
                className="ml-auto"
              />
            </>
          )}
          {isEditorOpened && (
            <>
              <NumberInput value={cell.quantity} onChange={handleOnChange} />
              <Select
                value={cell.uom}
                data={uom?.items?.map((u) => ({ value: u.id, label: u.name }))}
              />
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
      entity: 'Items',
      primaryKey: 'description',
      title: `Items: ${activity?.name ?? ''}`,
      onAdd: () => {
        open();
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
          accessorKey: 'unitPrice',
          cell: ({ getValue, row, column, table }) => (
            <EstimatedPrice
              getValue={getValue}
              row={row}
              column={column}
              table={table}
            />
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
          cell: ({ row: { original } }: any) => (
            <>
              {original.currency} {original.unitPrice * original.quantity}
            </>
          ),
          meta: {
            widget: 'expand',
          },
        },
      ],
      searchable: true,
      pagination: true,
    };
  }, [router, data]);

  const pathname = usePathname();

  const mode =
    pathname === `/pre-budget-plan/${budgetYear}/activities/items/${activityId}`
      ? 'list'
      : pathname ===
        `/pre-budget-plan/${budgetYear}/activities/items/${activityId}/new`
      ? 'new'
      : 'detail';

  const handelAddItem = (items) => {
    logger.log('items:', items);
    const castedData = items.map((item) => ({
      unitPrice: 0,
      currency: activity?.currency,
      quantity: 0,
      uom: item.uOMId,
      preBudgetPlanActivityId: activityId,
      description: item.description,
      metaData: item,
      itemCode: item.itemCode,
      measurement: item.measurementId,
    }));

    setData([...castedData, ...data]);
  };

  return (
    <>
      <EntityLayout
        mode={mode}
        config={config}
        data={list?.items ?? []}
        detail={children}
      />
      <ItemSelector onDone={handelAddItem} opened={opened} close={close} />
    </>
  );
}
