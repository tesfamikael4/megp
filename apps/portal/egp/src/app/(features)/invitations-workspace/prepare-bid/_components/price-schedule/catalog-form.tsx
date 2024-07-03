'use client';
import { Box, Group, Flex, Text, Divider, Title } from '@mantine/core';

import { Section, logger, notify } from '@megp/core-fe';
// import {
//   useLazyReadCatalogQuery,
// } from '../_api/catalog.api';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ZodType, z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLazyReadItemQuery } from '@/store/api/item-master/item-master.api';
import { CatalogDetailForm } from './catalog-only-form';
import { useGiveSpecForOpenMutation } from '../../../_api/items.api';
import { useLazyGetItemTemplateQuery } from '@/store/api/item-master/item-master.api';
import { DeliverDays } from './table-delivery-days';

export default function CatalogForm({ item }: { item: any }) {
  const [
    getTemplate,
    { data: template, isLoading: templateLoading, isSuccess },
  ] = useLazyGetItemTemplateQuery();
  const [deliveryValues, setDeliveryValues] = useState<any[]>([]);

  const [saveSpecForOpen, { isLoading: isGiving }] =
    useGiveSpecForOpenMutation();

  // const [trigger, { data: catalog }] = useLazyReadCatalogQuery();
  const [triggerReadItem, { data: itemMaster }] = useLazyReadItemQuery();

  const ValidationSchema = (data: any[]) => {
    const loc: { [key: string]: ZodType<any> } = {};

    data?.forEach((item: any) => {
      const nameToValidate = item.displayName?.toLowerCase().replace(' ', '');
      const uomFieldName = `${nameToValidate}_uom`;

      if (item.dataType === 'number') {
        loc[nameToValidate] = item.validation.isRequired
          ? z.number().min(1, { message: 'This field is required' })
          : z.number().optional();

        if (item.uom.length !== 0) {
          loc[uomFieldName] = z.string().optional();
        }
      } else if (
        item.dataType === 'string' ||
        item.dataType === 'singleSelect'
      ) {
        if (item.validation.isRequired) {
          loc[nameToValidate] = z
            .string({
              required_error: 'This field is required',
              invalid_type_error: 'This field is required',
            })
            .min(item.validation.min, {
              message: `Provide at least ${item.validation.min} characters`,
            });

          loc[uomFieldName] = z.string().optional();
        } else if (item.validation.min) {
          loc[nameToValidate] = z
            .string()
            .min(item.validation.min, {
              message: `Provide at least ${item.validation.min} characters`,
            })
            .optional();

          loc[uomFieldName] = z.string().optional();
        } else {
          loc[nameToValidate] = z.string().optional();
          loc[uomFieldName] = z.string().optional();
        }
      } else if (item.dataType === 'multiSelect') {
        loc[nameToValidate] = item.validation.isRequired
          ? z.array(z.any()).nullable()
          : z.array(z.any()).nullable().optional();

        loc[uomFieldName] = z.string().optional();
      } else if (item.dataType === 'boolean') {
        loc[nameToValidate] = z.boolean().default(false);
        loc[uomFieldName] = z.string().optional();
      }
    });

    return loc;
  };
  const templateSchema = z.object(ValidationSchema(template?.properties));
  const productCatalogSchema = templateSchema.extend({
    quantity: z.coerce.number({
      required_error: 'This field is required',
      invalid_type_error: 'This field is required ',
    }),
    location: z.coerce.string().optional(),
    deliverDays: z.number().optional(),
  });

  const {
    handleSubmit,
    formState: { errors },
    control,
    reset,
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(productCatalogSchema),
  });

  //action
  const onCreate = async (data) => {
    try {
      const res = await saveSpecForOpen({
        catalogueDeliveryValues: deliveryValues,
        rfxItemId: item?.id,
        catalogueSpecificationValues: template.properties.reduce(
          (acc, item) => {
            const nameToValidate = item.displayName
              .toLowerCase()
              .replace(/\s+/g, '');
            acc[nameToValidate] = data[nameToValidate];
            return acc;
          },
          {},
        ),
        quantity: data.quantity,
        description: itemMaster?.description,
      }).unwrap();
      notify('Success', 'Catalog created successfully');
    } catch {
      notify('Error', 'Error in creating');
    }
  };

  const onUpdate = async (data) => {
    try {
      const lastEntry = item?.rfxProductInvitations?.length - 1;
      await saveSpecForOpen({
        id: item?.rfxProductInvitations?.[lastEntry]
          ?.catalogueSpecificationValues?.id,
        rfxItemId: item?.id,
        catalogueDeliveryValues: deliveryValues,
        catalogueSpecificationValues: template.properties.reduce(
          (acc, item) => {
            const nameToValidate = item.displayName
              .toLowerCase()
              .replace(/\s+/g, '');
            acc[nameToValidate] = data[nameToValidate];
            return acc;
          },
          {},
        ),
        quantity: data.quantity,
      }).unwrap();
      notify('Success', 'Catalog updated successfully');
    } catch (err: any) {
      notify('Error', 'Error in updating');
    }
  };

  const onError = (err) => {
    logger.log(err);
  };

  useEffect(() => {
    getTemplate({ id: item?.itemCode });
  }, [item]);

  useEffect(() => {
    if (item?.rfxProductInvitations?.length > 0 && template && isSuccess) {
      const lastEntry = item?.rfxProductInvitations?.length - 1;
      item?.rfxProductInvitations?.[lastEntry]?.catalogueDeliveryValues &&
        setDeliveryValues(
          item?.rfxProductInvitations?.[lastEntry]?.catalogueDeliveryValues,
        );
    }
  }, [item, template, isSuccess]);

  return (
    <>
      {
        <Flex direction={'column'}>
          <Group>
            <Text>{itemMaster?.description}</Text>
          </Group>
          <Box mt={'md'}>
            <CatalogDetailForm
              mode={item?.rfxProductInvitations?.length > 0 ? 'update' : 'new'}
              template={template}
              schema={productCatalogSchema}
              isLoading={templateLoading || isGiving}
              onCreate={onCreate}
              onUpdate={onUpdate}
              onError={onError}
              item={item}
            />
          </Box>
          <Box className="p-4">
            <DeliverDays
              deliveryValues={deliveryValues}
              setDeliveryValues={setDeliveryValues}
            />
          </Box>
        </Flex>
      }
    </>
  );
}
