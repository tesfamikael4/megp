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
import { useLazyGetACategoryQuery, useLazyGetParentQuery } from '../../item-category/_api/custom-item-category';

interface FormDetailProps {
  mode: 'new' | 'detail';
}
const defaultValues = {
  commodityCode: '',
  commodityName: '',
  description: '',
  itemSubCategoryId: null,
  uOMId: null,
  uOMName: '',
  measurementId: null,
  itemTags: [],
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
  itemCategoryId: z.string({
    required_error: 'Item Category is required',
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
  const itemCategoryId = watch('itemCategoryId');

  // Fetching data
  const { data: measurements, isLoading: isMeasurementLoading } =
    useGetMeasurementsQuery({} as any);
  const [getCategories, { data: categories, isLoading: isCategoriesLoading }] =
    useLazyGetParentQuery({});
 const [getItemCategoryById, { data: itemCategory}] = useLazyGetACategoryQuery();
  const [getItemCatChildren, {isLoading: isCategoriesChildLoading }] = useLazyListQuery();
  
  const { data: tags, isLoading: isTagLoading } = useGetTagsQuery({} as any);
  const [
    getUnitOfMeasurements,
    {
      data: unitOfMeasurements,
      isLoading: isGettingUnitOfmeasurements,
      isSuccess: isUnitOfMeasurementsSuccess,
    },
  ] = useLazyGetUnitOfMeasurementsQuery();
  const { data: ItemSubCat, isLoading: isItemSubCatLoading } =
    useListItemSubCatQuery({});
  const [getItemTags, { data: itemTags, isSuccess: isItemTagSuccess }] =
    useLazyGetTagsByItemMasterQuery();
  const [getItemMasters, { data: itemData, isSuccess }] = useLazyReadQuery();
  const [create, { isLoading: isSaving }] = useCreateMutation();
  const [update, { isLoading: isUpdating }] = useUpdateMutation();
  const [remove, { isLoading: isDeleting }] = useDeleteMutation();
  const [selectedCategories, setSelectedCategories] = useState<any[]>([]);
  const [opened, { open, close }] = useDisclosure(false);
  // logger.log('item master', itemData);
  const treeConfig: TreeConfig<any> = {
    id: 'itemCategoryId',
    label: 'itemCategoryName',
    selectable: true,
    multipleSelect: true,
    selectedIds: selectedCategories,
    setSelectedIds: (data) => {
      setSelectedCategories(data);
    },
    load: async (data) => {
      logger.log("item category",data );
      const res = await getItemCatChildren({
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
        loading: isCategoriesChildLoading,
      };
    },
  };

  // Handling Form Submission
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
    const modNewTag = data.itemTags.map((tag) => {
      const idnew = itemData.itemTags.filter((t) => t.tagId == tag);
      return {
        tagId: tag,
        itemMasterId: id,
        id: idnew?.[0]?.id,
        // Include the itemMasterId for each tag
      };
    });
    const rawData = {
      ...data,
      itemTags: modNewTag,
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
      await remove(id?.toString()).unwrap();
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
      reset({
        description: itemData?.description,
        commodityCode: itemData?.commodityCode,
        commodityName: itemData?.commodityName,
        itemCategoryId: itemData?.itemCategoryId,
        itemSubCategoryId: itemData?.itemSubCategoryId,
        uOMId: itemData?.uOMId,
        uOMName: itemData?.uOMName,
        measurementId: itemData?.measurementId,
        itemTags: itemData?.itemTags.map((tag) => tag.tagId),
      });
      setItemCode(itemData?.itemCode);
    }
  }, [itemData, isSuccess, mode, setValue]);

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
      setValue('itemCategoryId', temp.itemCategoryId);
    }
  }, [selectedCategories, setValue]);

  useEffect(() => {
    const fetchSelectedCategory = async () => {
      logger.log('itemCategoryId', itemCategoryId);
      if(itemCategoryId){
        const item = await getItemCategoryById(itemCategoryId);
        logger.log('item', item);
      }
    }
    fetchSelectedCategory();
  }, [itemCategoryId]);

  return (
    <Box pos="relative">
      <LoadingOverlay
        visible={
          isMeasurementLoading ||
          isTagLoading ||
          isCategoriesLoading ||
          isItemSubCatLoading || 
          isCategoriesChildLoading
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
          value={itemCategory?.name}
          error={errors.itemCategoryId?.message as string}
          onClick={open}
        />
        <Controller
          name="itemSubCategoryId"
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
          <Button
            onClick={() => {
              if (selectedCategories.length === 0) {
                notify('Error', 'No Item Category Selected.');
              } else {
                setSelectedCategories(selectedCategories);
                close();
              }
            }}
          >
            Done
          </Button>
        </Group>
      </Modal>
    </Box>
  );
}
