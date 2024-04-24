import {
  Box,
  Button,
  Flex,
  Group,
  LoadingOverlay,
  Modal,
  MultiSelect,
  Select,
  Stack,
  TextInput,
  Textarea,
} from '@mantine/core';
import { EntityButton } from '@megp/entity';

import { Controller, useForm } from 'react-hook-form';
import {
  useDeleteMutation,
  useUpdateMutation,
  useCreateMutation,
  useLazyReadQuery,
} from '../_api/item-master.api';
import { MantineTree, TreeConfig, logger, notify } from '@megp/core-fe';
import { ZodType, z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ItemMaster } from '@/models/item-master';
import {
  useGetMeasurementsQuery,
  useLazyGetUnitOfMeasurementsQuery,
} from '@/store/api/measurements/measurements.api';
import {
  useGetTagsQuery,
  useLazyGetTagsByItemMasterQuery,
} from '@/store/api/tags/tags.api';
import ClassificationSelector from './classification-selector';
import { useLazyListQuery } from '../../item-category/_api/item-category';
import { useDisclosure } from '@mantine/hooks';
import { useListQuery as useListItemSubCatQuery } from '../../item-sub-category/_api/item-sub-category';

interface FormDetailProps {
  mode: 'new' | 'detail';
}
const defaultValues = {
  commodityCode: '',
  commodityName: '',
  description: '',
  itemSubCategoryName: '',
  itemSubCategoryId: '',
  uOMId: null,
  uOMName: '',
  measurementId: null,
  itemTags: [],
  itemCategoryName: '',
  itemCategoryId: null,
};

const itemSchema: ZodType<Partial<ItemMaster>> = z.object({
  commodityCode: z.string({
    required_error: 'Classification  is required',
  }),
  commodityName: z.string({
    required_error: 'Classification  is required',
  }),
  description: z.string({
    required_error: 'Description is required',
  }),
  uOMId: z.string({
    required_error: 'Unit of Measurement is required',
  }),
  uOMName: z.string({
    required_error: 'Unit of Measurement is required',
  }),
  measurementId: z.string({
    required_error: 'Measurement is required',
  }),
  itemCategoryName: z.string({
    required_error: 'Item Category is required',
  }),
  itemCategoryId: z.string({
    required_error: 'Item Category is required',
  }),
  itemSubCategoryName: z.string({
    required_error: 'Item Sub Category is required',
  }),
  itemSubCategoryId: z.string({
    required_error: 'Item Sub Category is required',
  }),
  itemTags: z.array(
    z.string({
      required_error: 'Item Tags is required',
    }),
  ),
});

export function FormDetail({ mode }: FormDetailProps) {
  const {
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors },
    watch,
  } = useForm<Partial<ItemMaster>>({
    resolver: zodResolver(itemSchema),
  });
  const { id } = useParams();
  const router = useRouter();
  const [itemCode, setItemCode] = useState<string>('');

  const { data: measurements, isLoading: isMeasurementLoading } =
    useGetMeasurementsQuery({} as any);
  const [getCategories, { data: categories, isLoading: isCategoriesLoading }] =
    useLazyListQuery();
  const { data: tags, isLoading: isTagLoading } = useGetTagsQuery({} as any);
  const [
    getUnitOfMeasurements,
    {
      data: unitOfMeasurements,
      isLoading: isGettingUnitOfmeasurements,
      isSuccess: isUnitOfMeasurementsSuccess,
    },
  ] = useLazyGetUnitOfMeasurementsQuery();
  const {
    data: ItemSubCat,
    isLoading: isItemSubCatLoading,
    isSuccess: isItemSubCatSuccess,
  } = useListItemSubCatQuery({});
  const [getItemTags, { data: itemTags, isSuccess: isItemTagSuccess }] =
    useLazyGetTagsByItemMasterQuery();
  const [getItemMasters, { data, isSuccess }] = useLazyReadQuery();
  const [create, { isLoading: isSaving }] = useCreateMutation();
  const [update, { isLoading: isUpdating }] = useUpdateMutation();
  const [remove, { isLoading: isDeleting }] = useDeleteMutation();

  const [selectedCategories, setSelectedCategories] = useState<any[]>([]);
  const [opened, { open, close }] = useDisclosure(false);
  const treeConfig: TreeConfig<any> = {
    id: 'itemCategoryId',
    label: 'itemCategoryName',
    selectable: true,
    multipleSelect: true,
    selectedIds: selectedCategories,
    setSelectedIds: (data) => {
      logger.log({ data });
      setSelectedCategories(data);
    },
    load: async (data) => {
      logger.log({ data });
      const res = await getCategories({
        where: [
          [
            {
              column: 'parentId',
              value: data.itemCategoryId,
              operator: 'ILIKE',
            },
          ],
        ],
      }).unwrap();
      return {
        result:
          res?.items?.map((c) => ({
            itemCategoryName: c.name,
            itemCategoryId: c.id,
          })) ?? [],
        loading: isCategoriesLoading,
      };
    },
  };
  const onCreate = async (data) => {
    const rawData = {
      ...data,
      itemTags: data.itemTags.map((tags) => ({ tagId: tags })),
    };
    try {
      const result = await create(rawData).unwrap();
      notify('Success', 'Item Master created successfully');

      router.push(`/item-master/${result.id}`);
    } catch (e) {
      notify('Error', 'Something went wrong');
    }
  };
  const onUpdate = async (data) => {
    const rawData = {
      ...data,
      itemTags: data.itemTags.map((tag) => ({ tagId: tag })),
    };
    try {
      const res = await update({ id: id as string, ...rawData }).unwrap();
      logger.log(res);
      notify('Success', 'Item Master updated successfully');
    } catch (e) {
      notify('Error', 'Something went wrong');
    }
  };
  const onDelete = async (data) => {
    try {
      await remove(id as string);
      notify('Success', 'Item Master deleted successfully');
      router.push(`/item-master`);
    } catch (e) {
      notify('Error', 'Something went wrong');
    }
  };
  const onReset = async () => {
    reset({ ...defaultValues });
  };

  //hooks
  useEffect(() => {
    mode == 'detail' && getItemMasters(id as string);
    mode == 'detail' && getItemTags(id as string);
  }, [mode, getItemMasters, id, getItemTags]);

  useEffect(() => {
    if (mode == 'detail' && isSuccess) {
      setValue('description', data?.description);
      setValue('commodityCode', data?.commodityCode);
      setValue('commodityName', data?.commodityName);
      setValue('itemCategoryId', data?.itemCategoryId);
      setValue('itemCategoryName', data?.itemCategoryName);
      setValue('itemSubCategoryId', data?.itemSubCategoryId);
      setValue('itemSubCategoryName', data?.itemSubCategoryName);
      setValue('uOMId', data?.uOMId);
      setValue('uOMName', data?.uOMName);
      setValue('measurementId', data?.measurementId);
      setItemCode(data?.itemCode);
    }
  }, [data, isSuccess, mode, setValue]);

  useEffect(() => {
    isItemTagSuccess &&
      setValue(
        'itemTags',
        itemTags.items.map((tag) => tag.tagId),
      );
  }, [isItemTagSuccess, itemTags, setValue]);

  useEffect(() => {
    const id: string | null = watch('measurementId') ?? null;
    if (id) {
      getUnitOfMeasurements(id);
    }
  }, [getUnitOfMeasurements, watch('measurementId')]);

  useEffect(() => {
    getCategories({
      where: [
        [
          {
            column: 'parentId',
            value: '',
            operator: '=',
          },
          {
            column: 'parentId',
            value: 'IsNull',
            operator: 'IsNull',
          },
        ],
      ],
    });
  }, []);
  useEffect(() => {
    if (selectedCategories.length > 0) {
      const temp = selectedCategories[selectedCategories.length - 1];
      logger.log({ temp });
      setValue('itemCategoryName', temp.itemCategoryName);
      setValue('itemCategoryId', temp.itemCategoryId);
    }
  }, [selectedCategories, setValue]);

  useEffect(() => {
    if (isItemSubCatSuccess) {
      setValue('itemSubCategoryName', ItemSubCat.items[0].name);
      setValue('itemSubCategoryId', ItemSubCat.items[0].id);
    }
  }, [ItemSubCat, isItemSubCatSuccess, setValue]);

  return (
    <Box pos="relative">
      <LoadingOverlay
        visible={
          isMeasurementLoading ||
          isTagLoading ||
          isCategoriesLoading ||
          isItemSubCatLoading
        }
      />
      <Stack>
        {mode == 'detail' && (
          <TextInput label="Item Code" value={itemCode} disabled />
        )}
        <Controller
          name="description"
          control={control}
          render={({ field: { value, name, onChange } }) => (
            <Textarea
              label="Description"
              name={name}
              value={value}
              onChange={onChange}
              withAsterisk
              autosize
              minRows={2}
              maxRows={10}
              error={errors?.description?.message as string | undefined}
            />
          )}
        />
        <TextInput
          label="Item Category"
          withAsterisk
          readOnly
          value={watch('itemCategoryName') ?? ''}
          error={errors.itemCategoryName?.message as string}
          onClick={open}
        />
        <Controller
          name="itemSubCategoryName"
          control={control}
          render={({ field: { value, name, onChange } }) => (
            <Select
              name={name}
              value={value}
              onChange={onChange}
              data={ItemSubCat?.items?.map((item) => ({
                value: item.id,
                label: item.name,
              }))}
              label="Item Sub Category"
              withAsterisk
              onReset={onReset}
              clearable
              error={errors.itemSubCategoryId?.message as string | undefined}
            />
          )}
        />

        <Flex gap="md">
          <Controller
            name="measurementId"
            control={control}
            render={({ field: { value, name, onChange } }) => (
              <Select
                name={name}
                value={value}
                onChange={onChange}
                data={measurements?.items?.map((measurement) => ({
                  value: measurement.id,
                  label: measurement.name,
                }))}
                label="Measurement"
                withAsterisk
                onReset={onReset}
                className="w-full"
                error={errors.measurementId?.message as string | undefined}
              />
            )}
          />
          <Controller
            name="uOMId"
            control={control}
            render={({ field: { value, name, onChange } }) => (
              <Select
                disabled={
                  !isUnitOfMeasurementsSuccess || isGettingUnitOfmeasurements
                }
                name={name}
                value={value}
                onChange={(value: any) => {
                  onChange(value);
                  setValue(
                    'uOMName',
                    unitOfMeasurements.items.filter((uom) => uom.id == value)[0]
                      .name,
                  );
                }}
                data={unitOfMeasurements?.items?.map((uom) => ({
                  value: uom.id,
                  label: uom.name,
                }))}
                label="Default Units of Measure"
                withAsterisk
                className="w-full"
                onReset={onReset}
                error={errors.uOMName?.message as string | undefined}
              />
            )}
          />
        </Flex>
        <ClassificationSelector
          onDone={(item) => {
            setValue('commodityName', item.title);
            setValue('commodityCode', item.code);
          }}
          selectedData={{
            id: watch('commodityCode'),
            name: watch('commodityName'),
          }}
          error={errors.commodityName?.message as string | null}
        />

        <Controller
          name="itemTags"
          control={control}
          render={({ field: { value, name, onChange } }) => (
            <MultiSelect
              label="Tags"
              name={name}
              value={value}
              onChange={onChange}
              withAsterisk
              data={tags?.items?.map((tag) => ({
                value: tag.id,
                label: tag.name,
              }))}
              searchable
              clearable
              error={errors.itemTags?.message as string | undefined}
            />
          )}
        />
        <EntityButton
          mode={mode}
          onCreate={handleSubmit(onCreate)}
          onUpdate={handleSubmit(onUpdate)}
          onDelete={handleSubmit(onDelete)}
          // data={data}
          onReset={onReset}
          isSaving={isSaving}
          isUpdating={isUpdating}
          isDeleting={isDeleting}
        />
      </Stack>

      <Modal title="Item Category" opened={opened} onClose={close} size="lg">
        <Box className="max-h-[30rem] overflow-auto">
          <MantineTree
            config={treeConfig}
            data={
              categories?.items?.map((c) => ({
                itemCategoryName: c.name,
                itemCategoryId: c.id,
              })) ?? []
            }
          />
        </Box>
        <Group justify="end" className="mt-2">
          <Button onClick={close}>Done</Button>
        </Group>
      </Modal>
    </Box>
  );
}
