'use client';
import { ExpandableTable, Section, logger, notify } from '@megp/core-fe';
import { LoadingOverlay, Button, Box } from '@mantine/core';
import { IconDeviceFloppy } from '@tabler/icons-react';

import { useSearchParams } from 'next/navigation';
import { CollectionQuery } from '@megp/entity';
import BillOfMaterial from './bill-of-material/bill-of-material';
import Labour from './labour/labour';
import Material from './material/material';
import Equipment from './equipment/equipment';
import Fee from './fee/fee';
import ReimburseableExpense from './reimburseable-expense/reimburseable-expense';
import { useContext, useEffect } from 'react';
import { PrepareBidContext } from '@/contexts/prepare-bid.context';
import { useLazyItemsQuery } from '@/app/(features)/tender-workspace/_api/item.api';
import { useSaveFinancialBidResponseMutation } from '@/app/(features)/tender-workspace/_api/item-bid-response.api';
import { Values } from '@/models/tender/bid-response/item-bid-response';
import { ZodType, z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, FormProvider } from 'react-hook-form';

export default function ItemList() {
  const searchParams = useSearchParams();
  const prepareBidContext = useContext(PrepareBidContext);
  const [trigger, { data, isFetching }] = useLazyItemsQuery();
  const [saveChanges, { isLoading: isSaving }] =
    useSaveFinancialBidResponseMutation();
  const handleSaveChanges = (data) => {
    const keys = Object.keys(data);
    let toApi: Values[] = [];
    keys.forEach((key) => {
      if (key !== 'itemId') {
        toApi = [...toApi, { key: key, value: data[key] }];
      }
    });
    saveChanges({
      lotId: searchParams.get('lot'),
      itemId: data.itemId,
      documentType: 'RESPONSE',
      values: toApi,
      password: prepareBidContext?.password,
    })
      .unwrap()
      .then(() => {
        notify('Success', 'tender created successfully');
      })
      .catch((error) => {
        let message = '';
        if (error.data.message === `rate_not_found`) {
          message = 'Rate is not filled for some rows please check';
        }
        notify('Error', message);
      });
  };

  let billOfMaterialSchema: z.ZodType<any> = z.lazy(() => {
    return z
      .object({
        parentCode: z.any().optional(),
        code: z.any().optional(),
        id: z.any().optional(),
        itemId: z.any().optional(),
        payItem: z.any().optional(),
        description: z.any().optional(),
        unit: z.any().optional(),
        quantity: z.any().optional(),
        rate: z
          .number({ required_error: 'rate is required' })
          .optional()
          .nullable(),
        amount: z.any().optional(),
        children: z.array(z.lazy(() => billOfMaterialSchema)).optional(),
      })
      .refine(
        (data) => {
          const hasChildren = data.children && data.children.length > 0;
          const rateIsProvided = data.rate !== null && data.rate !== undefined;

          if (hasChildren && rateIsProvided) {
            return true;
          } else if (!hasChildren && !rateIsProvided) {
            return false;
          }
          return true;
        },
        {
          message: 'Rate is required',
          path: ['rate'],
        },
      );
  });
  const bidPriceSchema: ZodType<any> = z.object({
    billOfMaterial: z.array(billOfMaterialSchema),
    itemId: z.string().min(1, { message: 'this field is required' }),
  });

  const methods = useForm({
    resolver: zodResolver(bidPriceSchema),
  });
  useEffect(() => {
    logger.log(methods.formState.errors);
  }, [methods.formState.errors]);

  const config = {
    columns: [
      { accessor: 'name', title: 'Name', width: 300 },
      { accessor: 'description', title: 'Description', width: 150 },
      { accessor: 'quantity', title: 'Quantity', width: 150 },
      { accessor: 'unitOfMeasure', title: 'Unit Of Measure', width: 150 },
      {
        accessor: 'procurementCategory',
        title: 'Procurement Category',
        width: 150,
      },
      {
        accessor: 'Rate',
        title: 'Rate',
        width: 150,
      },
    ],
    isExpandable: true,
    isSearchable: true,
    isLoading: isFetching,
    primaryColumn: 'name',
    expandedRowContent: (item) => {
      return (
        <>
          <FormProvider {...methods}>
            <div className="my-4">
              <BillOfMaterial item={item} />
            </div>
            <div className="my-4">
              <Labour item={item} />
            </div>
            <div className="my-4">
              <Material item={item} />
            </div>
            <div className="my-4">
              <Equipment item={item} />
            </div>
            <div className="my-4">
              <Fee item={item} />
            </div>
            <div className="my-4">
              <ReimburseableExpense item={item} />
            </div>
            <Box className="flex justify-end">
              <Button
                loading={isSaving}
                onClick={methods.handleSubmit(handleSaveChanges)}
              >
                <IconDeviceFloppy size={14} /> Save Changes
              </Button>
            </Box>
          </FormProvider>
        </>
      );
    },
  };

  const onRequestChange = async (request: CollectionQuery) => {
    trigger({
      data: {
        lotId: searchParams.get('lot'),
        documentType: 'RESPONSE',
        password: prepareBidContext?.password,
      },
      type: 'financial',
    });
  };
  useEffect(() => {
    trigger({
      data: {
        lotId: searchParams.get('lot'),
        documentType: 'RESPONSE',
        password: prepareBidContext?.password,
      },
      type: 'financial',
    });
  }, [prepareBidContext?.password, searchParams, trigger]);

  return (
    <Section
      title="Financial Offer"
      collapsible={false}
      defaultCollapsed={false}
    >
      <LoadingOverlay
        visible={isFetching}
        zIndex={1000}
        overlayProps={{ radius: 'sm', blur: 2 }}
      />
      <ExpandableTable
        config={config}
        data={data?.items ?? []}
        total={data?.total ?? 0}
        onRequestChange={onRequestChange}
      />
    </Section>
  );
}
