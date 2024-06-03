'use client';
import { Box, Group, Flex, Text, Divider, Title } from '@mantine/core';

import { Section, logger, notify } from '@megp/core-fe';
import {
  useCreateCatalogMutation,
  useLazyGetTemplateQuery,
  useLazyReadCatalogQuery,
  useUpdateCatalogMutation,
  useDeleteCatalogMutation,
} from '../_api/catalog.api';
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { ZodType, z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLazyReadItemQuery } from '@/store/api/item-master/item-master.api';
import { CatalogDetalForm } from './catalog-only-form';

export default function CatalogForm({ mode }: any) {
  const { itemId, id } = useParams();
  const router = useRouter();
  const [getTemplate, { data: template, isLoading: templateLoading }] =
    useLazyGetTemplateQuery();

  const [createCatalog, { isLoading: isSaving }] = useCreateCatalogMutation();
  const [updateCatalog, { isLoading: isUpdating }] = useUpdateCatalogMutation();
  const [deleteCatalog, { isLoading: isDeleting }] = useDeleteCatalogMutation();
  const [trigger, { data: catalog }] = useLazyReadCatalogQuery();
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
  } = useForm({
    resolver: zodResolver(productCatalogSchema),
  });

  //action
  const onCreate = async (data) => {
    try {
      const res = await createCatalog({
        itemMasterId: itemId.toString(),
        itemMasterCode: itemMaster?.itemCode,
        specificationTemplateId: template.id.toString(),
        deliveryValues: [],
        specificationValues: template.properties.map((item) => {
          const nameToValidate = item.displayName
            .toLowerCase()
            .replace(' ', '');
          const uomFieldName = `${nameToValidate}_uom`;
          return {
            key: item.key,
            value: data[nameToValidate],
            label: item.displayName,
            category: item.category,
            type: typeof data[nameToValidate],
            uom: data[uomFieldName] ?? '',
          };
        }),
        specifications: template.properties.reduce((acc, item) => {
          const nameToValidate = item.displayName
            .toLowerCase()
            .replace(/\s+/g, '');
          acc[nameToValidate] = data[nameToValidate];
          return acc;
        }, {}),
        quantity: data.quantity,
        description: itemMaster?.description,
      }).unwrap();
      notify('Success', 'Catalog created successfully');
      router.push(`product/${res?.id}`);
    } catch {
      notify('Error', 'Error in creating');
    }
  };

  const onUpdate = async (data) => {
    try {
      await updateCatalog({
        id: id.toString(),
        itemMasterId: itemId.toString(),
        itemMasterCode: itemMaster?.itemCode,
        specificationTemplateId: template.id.toString(),
        deliveryValues: [],
        specificationValues: template.properties.map((item) => {
          const nameToValidate = item.displayName
            .toLowerCase()
            .replace(' ', '');
          return {
            key: item.key,
            value: data[nameToValidate],
            label: item.displayName,
            category: item.category,
            uom: data[`${nameToValidate}_uom`] ?? '',
          };
        }),

        specifications: template.properties.reduce((acc, item) => {
          const nameToValidate = item.displayName
            .toLowerCase()
            .replace(/\s+/g, '');
          acc[nameToValidate] = data[nameToValidate];
          return acc;
        }, {}),
        quantity: data.quantity,
      }).unwrap();
      notify('Success', 'Catalog updated successfully');
    } catch {
      notify('Error', 'Error in updating');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteCatalog(id.toString()).unwrap();
      notify('Success', 'Catalog deleted successfully');
      router.push('/my-workspace/catalog-manager');
    } catch {
      notify('Error', 'Error in deleting');
    }
  };
  const onError = (err) => {
    logger.log(err);
  };

  useEffect(() => {
    id !== undefined && trigger(id?.toString());
  }, [id]);

  useEffect(() => {
    getTemplate(itemId.toString());
  }, [itemId]);

  useEffect(() => {
    if (id && catalog) {
      const temp = {};
      catalog?.specificationValues?.map((item) => {
        const nameToValidate = item?.label?.toLowerCase().replace(' ', '');
        temp[nameToValidate] = item?.value;
      });

      reset({
        ...temp,
        quantity: catalog?.quantity,
        location: catalog?.deliveryValues?.[0]?.location,
        deliverDays: catalog?.deliveryValues?.[0]?.deliverDays,
      });
    }
    logger.log(catalog?.deliveryValues?.[0]?.region);
  }, [catalog, reset, id]);

  useEffect(() => {
    triggerReadItem(itemId.toString());
  }, [itemId, trigger]);

  return (
    <>
      {mode == 'new' ? (
        <Section collapsible={false}>
          {mode == 'new' && (
            <Title order={4} className="mb-4">
              New Product Catalog
            </Title>
          )}
          <Flex direction={'column'}>
            <Group>
              <Text>{itemMaster?.description}</Text>
            </Group>
            <Box mt={'md'}>
              <CatalogDetalForm
                mode={'new'}
                template={template}
                schema={productCatalogSchema}
                isLoading={templateLoading}
                onCreate={onCreate}
                onUpdate={onUpdate}
                onError={onError}
                OnDelete={handleDelete}
                catalog={catalog}
              />
            </Box>
          </Flex>
        </Section>
      ) : (
        <Flex direction={'column'}>
          <Group>
            <Text>{itemMaster?.description}</Text>
          </Group>
          <Box mt={'md'}>
            <CatalogDetalForm
              mode={'detail'}
              template={template}
              schema={productCatalogSchema}
              isLoading={templateLoading}
              onCreate={onCreate}
              onUpdate={onUpdate}
              onError={onError}
              OnDelete={handleDelete}
              catalog={catalog}
            />
          </Box>
        </Flex>
      )}
    </>
  );
}
