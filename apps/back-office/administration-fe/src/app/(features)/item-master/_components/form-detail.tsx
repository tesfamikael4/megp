import {
  Box,
  Flex,
  LoadingOverlay,
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
import { logger } from '@megp/core-fe';
import { ZodType, z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
// import { useGetServicesQuery } from '@/store/api/service/service.api';
// import { Service } from '@/models/service';
import { notifications } from '@mantine/notifications';
import { Tree } from './tree/tree';
import { ItemMaster } from '@/models/item-master';
import {
  useGetMeasurementsQuery,
  useLazyGetUnitOfMeasurementsQuery,
} from '@/store/api/measurements/measurements.api';
import { useGetTagsQuery } from '@/store/api/tags/tags.api';
import { useGetCategoriesQuery } from '@/store/api/categories/categories.api';

interface FormDetailProps {
  mode: 'new' | 'detail';
}
const comodity = [
  {
    id: '3c8b6ac3-5eb0-4b25-b0c7-77a2f2a9a473',
    label: 'Segment 1',
    code: 'Code 123',
    children: [
      {
        id: '1a55a77a-5c3f-4e43-bb2a-aae8d6704e12',
        label: 'Family 1',
        code: 'Code 3232',
        children: [
          {
            id: '2f6a28a6-7f78-472d-845e-1b448bfc64d7',
            label: 'Class 1',
            code: 'Code 2342243',
            children: [
              {
                id: '1fd31f3a-7e58-4c17-88de-2d42840f3807',
                label: 'Commodity 1',
                code: 'Code 12331',
                children: [],
              },
              {
                id: 'f7d31f3a-7e58-4c17-88de-2d42840f3807',
                label: 'Commodity 2',
                code: 'Code 12332',
                children: [],
              },
            ],
          },
          {
            id: '7a5a7af2-5c3f-4e43-bb2a-aae8d6704e12',
            label: 'Class 2',
            code: 'Code 2342244',
            children: [
              {
                id: '2fd31f3a-7e58-4c17-88de-2d42840f3807',
                label: 'Commodity 3',
                code: 'Code 12333',
                children: [],
              },
              {
                id: '27d31f3a-7e58-4c17-88de-2d42840f3807',
                label: 'Commodity 4',
                code: 'Code 12334',
                children: [],
              },
            ],
          },
        ],
      },
      {
        id: '6b8b6ac3-5eb0-4b25-b0c7-77a2f2a9a473',
        label: 'Family 2',
        code: 'Code 3233',
        children: [
          {
            id: '3f6a28a6-7f78-472d-845e-1b448bfc64d7',
            label: 'Class 3',
            code: 'Code 2342245',
            children: [
              {
                id: '3fd31f3a-7e58-4c17-88de-2d42840f3807',
                label: 'Commodity 5',
                code: 'Code 12335',
                children: [],
              },
              {
                id: '37d31f3a-7e58-4c17-88de-2d42840f3807',
                label: 'Commodity 6',
                code: 'Code 12336',
                children: [],
              },
            ],
          },
          {
            id: '8a5a7af2-5c3f-4e43-bb2a-aae8d6704e12',
            label: 'Class 4',
            code: 'Code 2342246',
            children: [
              {
                id: '4fd31f3a-7e58-4c17-88de-2d42840f3807',
                label: 'Commodity 7',
                code: 'Code 12337',
                children: [],
              },
              {
                id: '47d31f3a-7e58-4c17-88de-2d42840f3807',
                label: 'Commodity 8',
                code: 'Code 12338',
                children: [],
              },
            ],
          },
        ],
      },
    ],
  },
];

const itemSchema: ZodType<Partial<ItemMaster>> = z.object({
  commodityCode: z.string({
    required_error: 'Commodity  is required',
  }),
  commodityName: z.string({
    required_error: 'Commodity  is required',
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
  itemSubcategoryName: z.string({
    required_error: 'Item Category is required',
  }),
  itemSubcategoryId: z.string({
    required_error: 'Item Category is required',
  }),
});

export function FormDetail({ mode }: FormDetailProps) {
  const {
    handleSubmit,
    reset,
    register,
    setValue,
    control,
    formState: { errors },
    watch,
  } = useForm<Partial<ItemMaster>>({
    resolver: zodResolver(itemSchema),
  });
  const { id } = useParams();
  const router = useRouter();

  const { data: measurements, isLoading: isMeasurementLoading } =
    useGetMeasurementsQuery({} as any);
  const { data: categories, isLoading: isCategoriesLoading } =
    useGetCategoriesQuery({} as any);
  const { data: tags, isLoading: isTagLoading } = useGetTagsQuery({} as any);
  const [
    getUnitOfMeasurements,
    {
      data: unitOfMeasurements,
      isLoading: isGettingUnitOfmeasurements,
      isSuccess: isUnitOfMeasurementsSuccess,
    },
  ] = useLazyGetUnitOfMeasurementsQuery();
  const [getItemMasters, { data, isSuccess }] = useLazyReadQuery();
  const [create, { isLoading: isSaving }] = useCreateMutation();
  const [update, { isLoading: isUpdating }] = useUpdateMutation();
  const [remove, { isLoading: isDeleting }] = useDeleteMutation();

  const onCreate = async (data) => {
    logger.log(data);
    try {
      const result = await create(data).unwrap();
      notifications.show({
        color: 'green',
        message: 'Success-fully created',
        title: 'Success',
      });
      router.push(`/item-master/${result.id}`);
    } catch (e) {
      notifications.show({
        color: 'red',
        message: 'Something went wrong',
        title: 'Error',
      });
    }
  };
  const onUpdate = async (data) => {
    try {
      await update({ id: id as string, ...data });
      notifications.show({
        color: 'green',
        message: 'Success-fully Updated',
        title: 'Success',
      });
    } catch (e) {
      notifications.show({
        color: 'red',
        message: 'Something went wrong',
        title: 'Error',
      });
    }
  };
  const onDelete = async (data) => {
    try {
      await remove(id as string);
      notifications.show({
        color: 'green',
        message: 'Success-fully deleted',
        title: 'Success',
      });
      router.push(`/item-master`);
    } catch (e) {
      notifications.show({
        color: 'red',
        message: 'Something went wrong',
        title: 'Error',
      });
    }
  };
  const onReset = async () => {
    reset({
      commodityCode: '',
      commodityName: '',
      description: '',
      itemSubcategoryName: '',
      itemSubcategoryId: '',
      uOMId: '',
      uOMName: '',
    });
  };

  //hooks
  useEffect(() => {
    mode == 'detail' && getItemMasters(id as string);
  }, [mode, getItemMasters, id]);

  useEffect(() => {
    if (mode == 'detail' && isSuccess) {
      setValue('description', data.description);
      setValue('commodityCode', data.commodityCode);
      setValue('commodityName', data.commodityName);
      setValue('itemSubcategoryId', data.itemSubcategoryId);
      setValue('itemSubcategoryName', data.itemSubcategoryName);
      setValue('uOMId', data.uOMId);
      setValue('uOMName', data.uOMName);
      setValue('measurementId', data.measurementId);
    }
  }, [data, isSuccess, mode, setValue]);

  useEffect(() => {
    const id: string | undefined = watch('measurementId');
    if (id) {
      getUnitOfMeasurements(id);
    }
  }, [getUnitOfMeasurements, watch('measurementId')]);

  return (
    <Box pos="relative">
      <LoadingOverlay
        visible={isMeasurementLoading || isTagLoading || isCategoriesLoading}
      />
      <Stack>
        <Tree
          accessorKeys={{ label: 'label', children: 'children' }}
          mode="select"
          label="Commodity"
          items={comodity}
          onDone={(item) => {
            setValue('commodityName', 'Furniture');
            setValue('commodityCode', '11223344');
          }}
          placeholder="Select category"
          selectedItem={{ label: watch('commodityName') }}
          error={errors.commodityName?.message}
          // multiSelect
          disableParentSelect
        />
        <Textarea
          label="Description"
          withAsterisk
          {...register('description')}
        />
        <Tree
          accessorKeys={{ label: 'name', children: 'childCategories' }}
          mode="select"
          label="Item Category"
          items={categories?.items ?? []}
          onDone={(item) => {
            setValue('itemSubcategoryName', item.name);
            setValue('itemSubcategoryId', item.id);
          }}
          placeholder="Select category"
          selectedItem={{ label: watch('itemSubcategoryName') }}
          error={errors.itemSubcategoryName?.message}
          // multiSelect
          // disableParentSelect
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
                className="w-full"
                error={errors.measurementId?.message}
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
                label="Units of Measure"
                withAsterisk
                className="w-full"
              />
            )}
          />
        </Flex>

        <MultiSelect
          label="Tags"
          data={tags?.items?.map((tag) => ({
            value: tag.id,
            label: tag.name,
          }))}
          searchable
          clearable
        />
        <EntityButton
          mode={mode}
          onCreate={handleSubmit(onCreate)}
          onUpdate={handleSubmit(onUpdate)}
          onDelete={handleSubmit(onDelete)}
          onReset={onReset}
          isSaving={isSaving}
          isUpdating={isUpdating}
          isDeleting={isDeleting}
        />
      </Stack>
    </Box>
  );
}
