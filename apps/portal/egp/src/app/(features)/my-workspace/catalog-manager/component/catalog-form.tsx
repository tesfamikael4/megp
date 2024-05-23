'use client';
import {
  Box,
  Group,
  Stack,
  TextInput,
  LoadingOverlay,
  NumberInput,
  Flex,
  Text,
  Checkbox,
  Select,
  MultiSelect,
  Button,
  Divider,
} from '@mantine/core';

import { Section, logger, notify } from '@megp/core-fe';
import {
  useCreateCatalogMutation,
  useLazyGetTemplateQuery,
  useLazyReadCatalogQuery,
  useUpdateCatalogMutation,
  useDeleteCatalogMutation,
  useGetRegionsQuery,
  useLazyGetDistrictsQuery,
} from '../_api/catalog.api';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ZodType, z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { IconChevronLeft } from '@tabler/icons-react';
import { useLazyReadItemQuery } from '@/store/api/item-master/item-master.api';

export default function CatalogForm({ mode }: any) {
  const { itemId, id } = useParams();
  const router = useRouter();
  const [getTemplate, { data: template, isLoading: templateLoading }] =
    useLazyGetTemplateQuery();
  const [triggerDistrict, { data: districts }] = useLazyGetDistrictsQuery();

  const [createCatalog, { isLoading: isSaving }] = useCreateCatalogMutation();
  const [updateCatalog, { isLoading: isUpdating }] = useUpdateCatalogMutation();
  const [deleteCatalog, { isLoading: isDeleting }] = useDeleteCatalogMutation();
  const [trigger, { data: catalog }] = useLazyReadCatalogQuery();
  const [triggerReadItem, { data: itemMaster }] = useLazyReadItemQuery();
  const [selectedRegion, setSelectedRegion] = useState<any>();
  const { data: regions } = useGetRegionsQuery(undefined);

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
        item.dataType == 'singleSelect'
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
        deliveryValues: [
          {
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
            label: item.displayName,
            category: item.category,
            type: typeof data[nameToValidate],
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
        deliveryValues:
          data.location || data.deliverDays
            ? [
                {
                  location: data?.location,
                  deliverDays: data?.deliverDays,
                  regions: selectedRegion,
                },
              ]
            : [],
        specificationValues: template.properties.map((item) => {
          const nameToValidate = item.displayName
            .toLowerCase()
            .replace(' ', '');
          return {
            key: item.key,
            value: data[nameToValidate],
            label: item.displayName,
            category: item.category,
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
      setSelectedRegion(catalog?.deliveryValues?.[0]?.region);
    }
    logger.log(catalog?.deliveryValues?.[0]?.region);
  }, [catalog, reset, id]);
  logger.log(selectedRegion);

  useEffect(() => {
    triggerReadItem(itemId.toString());
  }, [itemId, trigger]);

  useEffect(() => {
    selectedRegion !== undefined && triggerDistrict(selectedRegion);
  }, [selectedRegion, triggerDistrict]);

  const catalogForm = () => {
    return (
      <>
        <LoadingOverlay visible={templateLoading} />
        <Box mih={'80vh'} className="w-full mr-2">
          <Stack className="w-full ">
            <Box className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {template?.properties?.map((item, index) => {
                const nameToValidate = item.displayName
                  .toLowerCase()
                  .replace(' ', '');
                return item.validation.type == 'string' ? (
                  <Controller
                    key={index}
                    name={nameToValidate}
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <TextInput
                        className="w-full"
                        label={item?.displayName}
                        value={value}
                        onChange={onChange}
                        placeholder={item?.displayName}
                        required={item?.validation?.isRequired}
                        rightSection={item?.uom ? item?.uom : ''}
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
                        rightSection={item?.uom ? item?.uom : ''}
                        onChange={onChange}
                        placeholder={item?.displayName}
                        required={item?.validation?.isRequired}
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
                        className=" mt-auto"
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
                ) : item.dataType == 'singleSelect' ? (
                  <Controller
                    key={index}
                    name={nameToValidate}
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <Select
                        name="name"
                        label={item?.displayName}
                        value={value}
                        rightSection={item?.uom ? item?.uom : ''}
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
                        rightSection={item?.uom ? item?.uom : ''}
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
                    render={({ field: { value, onChange } }) => (
                      <NumberInput
                        // name="name"
                        label={'Quantity'}
                        value={value}
                        onChange={onChange}
                        error={errors?.quantity?.message?.toString() ?? ''}
                      />
                    )}
                  />

                  <Controller
                    name="region"
                    control={control}
                    render={() => (
                      <Select
                        required
                        label={'Region'}
                        value={selectedRegion}
                        onChange={(value) => setSelectedRegion(value)}
                        data={
                          regions?.items?.map((item) => ({
                            label: item.name,
                            value: item.id,
                          })) || []
                        }
                        maxDropdownHeight={400}
                      />
                    )}
                  />
                  <Controller
                    name="location"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <Select
                        required
                        label={'District'}
                        value={value}
                        onChange={onChange}
                        data={
                          districts?.items?.map((item) => ({
                            label: item.name,
                            value: item?.id,
                          })) || []
                        }
                        maxDropdownHeight={400}
                      />
                    )}
                  />

                  <Controller
                    name={'deliverDays'}
                    control={control}
                    render={({ field: { value, onChange } }) => (
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
            </Box>
            {template?.properties?.length > 0 && (
              <Group className="ml-auto  mt-6">
                {mode == 'new' ? (
                  <Button
                    onClick={handleSubmit(onCreate, onError)}
                    loading={isSaving}
                  >
                    Save
                  </Button>
                ) : (
                  <>
                    {' '}
                    <Button
                      onClick={handleSubmit(onUpdate, onError)}
                      loading={isUpdating}
                    >
                      Update
                    </Button>
                    <Button
                      mr={'md'}
                      color="red"
                      onClick={handleDelete}
                      loading={isDeleting}
                    >
                      Delete
                    </Button>
                  </>
                )}
              </Group>
            )}
          </Stack>
        </Box>
      </>
    );
  };

  return (
    <>
      {mode == 'new' ? (
        <Section
          collapsible={false}
          title={
            <Flex dir="row">
              <IconChevronLeft
                size={30}
                className="mr-6"
                onClick={() => router.push('/my-workspace/catalog-manager')}
              />
              Item Specification
            </Flex>
          }
        >
          {catalogForm()}
        </Section>
      ) : (
        <Flex direction={'column'}>
          <Flex dir="row">
            <IconChevronLeft
              size={30}
              className="mr-2"
              onClick={() => router.push('/my-workspace/catalog-manager')}
            />
            <Text fw={'bold'}>Item Specification</Text>
          </Flex>
          <Divider my={'sm'} />
          <Group>
            <Text>{itemMaster?.description}</Text>
          </Group>
          <Box mt={'md'}> {catalogForm()} </Box>
        </Flex>
      )}
    </>
  );
}
