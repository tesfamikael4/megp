'use client';
import { ExpandableTable, Section, notify } from '@megp/core-fe';
import { LoadingOverlay, ActionIcon, Button, Box } from '@mantine/core';
import { IconDeviceFloppy } from '@tabler/icons-react';

import { useParams, useRouter, useSearchParams } from 'next/navigation';
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
  const router = useRouter();
  const { id } = useParams();
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
      .catch(() => {
        notify('Error', 'Already Registered');
      });
  };
  let billOfMaterialSchema;

  billOfMaterialSchema = z.object({
    parentCode: z.string().optional(),
    code: z.string().optional(),
    id: z.string().optional(),
    itemId: z.string().optional(),
    payItem: z.string().optional(),
    description: z.string().optional(),
    unit: z.string().optional(),
    quantity: z.number().optional(),
    rate: z.number(),
    amount: z.string().optional(),
    children: z.array(billOfMaterialSchema),
  });
  const bidPriceSchema: ZodType<any> = z.object({
    billOfMaterial: z.array(billOfMaterialSchema),
    itemId: z.string().min(1, { message: 'this field is required' }),
  });

  const methods = useForm({
    resolver: zodResolver(bidPriceSchema),
  });

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
              <Button>
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
  }, [searchParams, trigger]);

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
