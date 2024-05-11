'use client';
import {
  Box,
  Group,
  Stack,
  TextInput,
  LoadingOverlay,
  keys,
  NumberInput,
  Flex,
  Checkbox,
  Select,
  MultiSelect,
  Button,
} from '@mantine/core';

import { Section, logger, notify } from '@megp/core-fe';
import {
  useCreateCatalogMutation,
  useLazyGetTemplateQuery,
  useUpdateCatalogMutation,
} from '../_api/catalog.api';
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { IconArrowLeft } from '@tabler/icons-react';
import { Controller, useForm } from 'react-hook-form';
import { ZodType, late, z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { UploadImage } from './image-upload';
import { DateInput } from '@mantine/dates';

export default function CatalogForm({ mode }: any) {
  const { itemId, id } = useParams();
  const router = useRouter();
  const [getTemplate, { data: template, isLoading: templateLoading }] =
    useLazyGetTemplateQuery();

  const [createCatalog, { isLoading: isSaving }] = useCreateCatalogMutation();
  const [updateCatalog, { isLoading: isUpdating }] = useUpdateCatalogMutation();

  const ValidationSchema = (data: any[]) => {
    const loc: { [key: string]: ZodType<any> } = {};

    data?.forEach((item: any) => {
      const nameToValidate = item.displayName?.toLowerCase().replace(' ', '');
      if (item.dataType === 'number') {
        if (item.validation.isRequired) {
          return (loc[nameToValidate] = z
            .number()
            .min(1, { message: 'This field is required' }));
        } else {
          return (loc[nameToValidate] = z.number().optional());
        }
      } else if (
        item.dataType === 'string' ||
        item.validation.type == 'singleSelect'
      ) {
        if (item.validation.isRequired) {
          return (loc[nameToValidate] = z
            .string({
              required_error: 'This field is required',
              invalid_type_error: 'This field is required to be a string',
            })
            .min(item.validation.min, {
              message: `Provide at least ${item.validation.min} characters`,
            }));
        } else if (item.validation.min) {
          return (loc[nameToValidate] = z
            .string()
            .min(item.validation.min, {
              message: `Provide at least ${item.validation.min} characters`,
            })
            .optional());
        } else if (
          item.validation.isRequired == 'undefined' ||
          !item.validation.isRequired
        ) {
          return (loc[nameToValidate] = z.string().optional());
        } else {
          return (loc[nameToValidate] = z.string().optional());
        }
      } else if (item.validation.type === 'multiSelect') {
        return item.validation.isRequired
          ? (loc[nameToValidate] = z.array(z.any()).nullable())
          : (loc[nameToValidate] = z.array(z.any()).nullable().optional());
      } else if (item.dataType === 'boolean') {
        loc[nameToValidate] = z.boolean().default(false);
      }
    });
    return loc;
  };

  const templateSchema = z.object(ValidationSchema(template?.properties));
  const productCatalogSchema = templateSchema.extend({
    quantity: z.number().optional(),
    location: z.string().optional(),
    deliveryDate: z.date().optional(),
    deliverDays: z.number().optional(),
  });

  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    resolver: zodResolver(productCatalogSchema),
  });

  //action
  const onCreate = async (data) => {
    try {
      await createCatalog({
        itemMasterId: itemId.toString(),
        specificationTemplateId: template.id.toString(),
        deliveryValues: [
          {
            deliveryDate: data.deliveryDate,
            location: data.location,
            deliverDays: data.deliverDays,
          },
        ],
        specificationValues: template.properties.map((item) => {
          const nameToValidate = item.displayName
            .toLowerCase()
            .replace(' ', '');
          return {
            key: item.key,
            value: data[nameToValidate],
            lable: item.displayName,
            category: item.category,
          };
        }),
        quantity: data.quantity,
      }).unwrap();
      notify('Success', 'Catalog created successfully');
      router.push(`catalog-manager/${itemId}/${id}`);
    } catch {
      notify('Error', 'Error in creating');
    }
  };

  const onUpdate = async (data) => {
    try {
      await updateCatalog({
        itemMasterId: itemId.toString(),
        specificationTemplateId: template.id.toString(),
        deliveryValues: [
          {
            deliveryDate: data.deliveryDate,
            location: data.location,
            deliverDays: data.deliverDays,
          },
        ],
        specificationValues: template.properties.map((item) => {
          const nameToValidate = item.displayName
            .toLowerCase()
            .replace(' ', '');
          return {
            key: item.key,
            value: data[nameToValidate],
            lable: item.displayName,
            category: item.category,
          };
        }),
        quantity: data.quantity,
      }).unwrap();
      notify('Success', 'Catalog updated successfully');
    } catch {
      notify('Error', 'Error in updating');
    }
  };

  const onError = (err) => {
    logger.log(err);
  };

  useEffect(() => {
    getTemplate(itemId.toString());
  }, [itemId]);

  return (
    <>
      <Section
        collapsible={false}
        title={
          <Flex dir="row">
            <IconArrowLeft
              size={30}
              className="mr-6"
              onClick={() => router.push('/my-workspace/catalog-manager')}
            />
            Item Specification
          </Flex>
        }
      >
        <LoadingOverlay visible={templateLoading} />
        <Box mih={'100vh'}>
          <Flex gap={'sm'} align={'flex-start'}>
            <Stack className="w-full">
              {template?.properties?.map((item, index) => {
                const nameToValidate = item.displayName
                  .toLowerCase()
                  .replace(' ', '');
                return item.validation.type == 'string' ? (
                  <Controller
                    key={index}
                    name={nameToValidate}
                    control={control}
                    render={({ field: { name, value, onChange } }) => (
                      <TextInput
                        label={item?.displayName}
                        value={value}
                        onChange={onChange}
                        placeholder={item?.displayName}
                        required={item?.validation?.min}
                        error={
                          errors?.[nameToValidate]?.message?.toString() ?? ''
                        }
                      />
                    )}
                  />
                ) : item.validation.type == 'number' ? (
                  <Controller
                    key={index}
                    name={nameToValidate}
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <NumberInput
                        label={item?.displayName}
                        value={value}
                        onChange={onChange}
                        placeholder={item?.displayName}
                        required={item?.validation?.min}
                        error={
                          errors?.[nameToValidate]?.message?.toString() ?? ''
                        }
                      />
                    )}
                  />
                ) : item.dataType == 'boolean' ? (
                  <Controller
                    key={index}
                    name={nameToValidate}
                    control={control}
                    render={({ field: { name, value, onChange } }) => (
                      <Checkbox
                        label={item?.displayName}
                        name={name}
                        value={value}
                        onChange={onChange}
                        placeholder={item?.displayName}
                        error={
                          errors?.[nameToValidate]?.message?.toString() ?? ''
                        }
                      />
                    )}
                  />
                ) : item.validation.type == 'singleSelect' ? (
                  <Controller
                    key={index}
                    name={nameToValidate}
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <Select
                        name="name"
                        label={item?.displayName}
                        value={value}
                        data={
                          item?.validation?.enum?.map((i) => {
                            return {
                              value: i,
                              lable: i,
                            };
                          }) || []
                        }
                        onChange={onChange}
                        placeholder={item?.displayName}
                        withAsterisk={item?.validation?.isRequired ?? false}
                        error={
                          errors?.[nameToValidate]?.message?.toString() ?? ''
                        }
                      />
                    )}
                  />
                ) : item.validation.type == 'multiSelect' ? (
                  <Controller
                    key={index}
                    name={nameToValidate}
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <MultiSelect
                        name="name"
                        label={item?.displayName}
                        value={value}
                        data={
                          item?.validation?.enum?.map((i) => {
                            return {
                              value: i,
                              lable: i,
                            };
                          }) || []
                        }
                        onChange={onChange}
                        placeholder={item?.displayName}
                        withAsterisk={item?.validation?.isRequired ?? false}
                        error={
                          errors?.[nameToValidate]?.message?.toString() ?? ''
                        }
                      />
                    )}
                  />
                ) : null;
              })}
              {template?.properties?.length > 0 && (
                <>
                  <Controller
                    name={'quantity'}
                    control={control}
                    render={({ field: { name, value, onChange } }) => (
                      <NumberInput
                        label={'Quantity'}
                        value={value}
                        onChange={onChange}
                        error={errors?.quantity?.message?.toString() ?? ''}
                      />
                    )}
                  />
                  <TextInput label={'Location'} name="location" />
                  <Controller
                    name={'deliveryDate'}
                    control={control}
                    render={({ field: { name, value, onChange } }) => (
                      <DateInput
                        label={'Delivery Date'}
                        value={value}
                        onChange={onChange}
                        error={errors?.deliveryDate?.message?.toString() ?? ''}
                      />
                    )}
                  />
                  <Controller
                    name={'deliverDays'}
                    control={control}
                    render={({ field: { name, value, onChange } }) => (
                      <NumberInput
                        label={'Delivery Days'}
                        value={value}
                        onChange={onChange}
                        error={errors?.deliverDays?.message?.toString() ?? ''}
                      />
                    )}
                  />
                </>
              )}
              {template?.properties?.length > 0 && (
                <Group className="ml-auto">
                  {mode == 'new' ? (
                    <Button onClick={handleSubmit(onCreate, onError)}>
                      Save
                    </Button>
                  ) : (
                    <Button onClick={handleSubmit(onUpdate, onError)}>
                      Update
                    </Button>
                  )}
                </Group>
              )}
            </Stack>

            <Group className=" w-full mt-5 ">
              <UploadImage />
            </Group>
          </Flex>
        </Box>
      </Section>
    </>
  );
}
