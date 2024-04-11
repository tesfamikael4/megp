'use client';
import { ExpandableTable, Section, notify } from '@megp/core-fe';
import { LoadingOverlay, Button, Box } from '@mantine/core';
import { IconDeviceFloppy } from '@tabler/icons-react';

import { useSearchParams } from 'next/navigation';
import { CollectionQuery } from '@megp/entity';
import TechnicalRequirement from './technical-requirement/technical-requirement';
import { SorType } from '@/models/tender/lot/item/technical-requirement.model';
import { useContext, useEffect } from 'react';
import { useLazyItemsQuery } from '@/app/(features)/tender-workspace/_api/item.api';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, FormProvider } from 'react-hook-form';
import { ZodType, z } from 'zod';
import { PrepareBidContext } from '@/contexts/prepare-bid.context';
import { Values } from '@/models/tender/bid-response/item-bid-response';
import { useSaveTechnicalBidResponseMutation } from '@/app/(features)/tender-workspace/_api/item-bid-response.api';

export default function ItemList() {
  const searchParams = useSearchParams();
  const [trigger, { data, isFetching }] = useLazyItemsQuery();
  const password = useContext(PrepareBidContext);
  const [saveChanges, { isLoading: isSaving }] =
    useSaveTechnicalBidResponseMutation();
  const handleSaveChanges = (data) => {
    const keys = Object.keys(data);
    let toApi: Values[] = [];
    keys.forEach((key) => {
      toApi = [...toApi, { key: key, value: data[key] }];
    });
    saveChanges({
      lotId: searchParams.get('lot'),
      itemId: data.itemId,
      documentType: 'RESPONSE',
      values: toApi,
      password: password?.password,
    })
      .unwrap()
      .then(() => {
        notify('Success', 'tender created successfully');
      })
      .catch(() => {
        notify('Error', 'Already Registered');
      });
  };
  const sorTypes = () => {
    const sorType = {};
    Object.values(SorType).forEach((item: string) => {
      sorType[item] = z.array(technicalComplianceSchema);
    });
    return sorType;
  };
  const technicalComplianceSchema = z.object({
    category: z.string().optional(),
    formLink: z.string().optional(),
    id: z.string().optional(),
    itemId: z.string().optional(),
    requirement: z.string().optional(),
    requirementCondition: z.string().optional(),
    requirementType: z.string().optional(),
    sorType: z.string().optional(),
    compliance: z.enum(['Comply', 'Not Comply'], {
      required_error: 'this field is required',
    }),
    offeredSpecification: z
      .string()
      .min(1, { message: 'this field is required' }),
    remark: z.string().optional(),
  });
  const technicalRequirement: ZodType<any> = z.object({
    specification: z.array(technicalComplianceSchema),
    itemId: z.string().min(1, { message: 'this field is required' }),
  });

  const methods = useForm({
    resolver: zodResolver(technicalRequirement),
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
              <TechnicalRequirement item={item} type={SorType.SPECIFICATION} />
            </div>
            <div className="my-4">
              <TechnicalRequirement item={item} type={SorType.PERSONAL} />
            </div>

            <div className="my-4">
              <TechnicalRequirement item={item} type={SorType.DELIVERY} />
            </div>

            <div className="my-4">
              <TechnicalRequirement item={item} type={SorType.PACKAGING} />
            </div>

            <div className="my-4">
              <TechnicalRequirement item={item} type={SorType.WARRANTY} />
            </div>
            <div className="my-4">
              <TechnicalRequirement item={item} type={SorType.INCIDENTAL} />
            </div>
          </FormProvider>
          <Box className="flex justify-end">
            <Button
              loading={isSaving}
              onClick={methods.handleSubmit(handleSaveChanges)}
            >
              <IconDeviceFloppy size={14} /> Save Changes
            </Button>
          </Box>
        </>
      );
    },
  };

  const onRequestChange = (request: CollectionQuery) => {
    trigger({ lotId: searchParams.get('lot') ?? '', collectionQuery: request });
  };

  return (
    <Section
      title="Technical Offer"
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
