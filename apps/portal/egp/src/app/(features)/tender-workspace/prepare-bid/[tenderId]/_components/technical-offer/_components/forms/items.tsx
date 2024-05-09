'use client';
import { ExpandableTable, Section, logger, notify } from '@megp/core-fe';
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
import { ProcurementCategory } from '@/models/tender/lot/item';
import { SorType as GoodsSorType } from '@/models/tender/lot/item/goods.model';
import { SorType as WorksSorType } from '@/models/tender/lot/item/work.model';
import { SorType as ConsultancySorType } from '@/models/tender/lot/item/consultancy';
import { SorType as NonConsultancySorType } from '@/models/tender/lot/item/non-consultancy.model';
export default function ItemList() {
  const searchParams = useSearchParams();
  const [trigger, { data, isFetching }] = useLazyItemsQuery();
  const prepareBidContext = useContext(PrepareBidContext);
  const [saveChanges, { isLoading: isSaving }] =
    useSaveTechnicalBidResponseMutation();
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
    specification: z.array(technicalComplianceSchema, {
      required_error: `all the specification must be filled please expand and check that all the value are filled`,
    }),
    delivery: z
      .array(technicalComplianceSchema, {
        required_error: `all the delivery must be filled please expand and check that all the value are filled`,
      })
      .optional(),
    packagingAndLabeling: z
      .array(technicalComplianceSchema, {
        required_error: `all the packaging and labeling and labeling must be filled please expand and check that all the value are filled`,
      })
      .optional(),
    personal: z
      .array(technicalComplianceSchema, {
        required_error: `all the personal and labeling must be filled please expand and check that all the value are filled`,
      })
      .optional(),
    warrantyAndSupport: z
      .array(technicalComplianceSchema, {
        required_error: `all the warranty and support must be filled please expand and check that all the value are filled`,
      })
      .optional(),
    incidentalRequirement: z
      .array(technicalComplianceSchema, {
        required_error: `all the incidental requirement must be filled please expand and check that all the value are filled`,
      })
      .optional(),
    itemId: z.string().min(1, { message: 'this field is required' }),
    procurementCategory: z
      .string()
      .min(1, { message: 'this field is required' }),
  });

  const methods = useForm({
    resolver: zodResolver(technicalRequirement),
  });
  useEffect(() => {
    logger.log(methods.formState.errors);
  }, [methods.formState.errors]);
  const sorTypeDefinition = (sorTypes, selected) => {
    return Object.keys(sorTypes).map((sorType) => (
      <div className="my-4" key={sorType}>
        <TechnicalRequirement
          item={selected}
          type={sorType}
          title={sorTypes[sorType]}
        />
      </div>
    ));
  };

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
            {item?.procurementCategory &&
              ((item.procurementCategory === ProcurementCategory.GOODS &&
                sorTypeDefinition(GoodsSorType, item)) ||
                (item.procurementCategory === ProcurementCategory.WORKS &&
                  sorTypeDefinition(WorksSorType, item)) ||
                (item.procurementCategory ===
                  ProcurementCategory.CONSULTANCYSERVICES &&
                  sorTypeDefinition(ConsultancySorType, item)) ||
                (item.procurementCategory ===
                  ProcurementCategory.NONCONSUTANCYSERVICES &&
                  sorTypeDefinition(NonConsultancySorType, item)))}
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

  const onRequestChange = async (request: CollectionQuery) => {
    trigger({
      data: {
        lotId: searchParams.get('lot'),
        documentType: 'RESPONSE',
        password: prepareBidContext?.password,
      },
      type: 'technical',
    });
  };
  useEffect(() => {
    trigger({
      data: {
        lotId: searchParams.get('lot'),
        documentType: 'RESPONSE',
        password: prepareBidContext?.password,
      },
      type: 'technical',
    });
  }, [searchParams, trigger]);
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
