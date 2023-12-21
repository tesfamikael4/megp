import {
  Box,
  Button,
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
import { ZodType, z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { notifications } from '@mantine/notifications';
import { Tree } from '@megp/core-fe';
import {
  useGetMeasurementsQuery,
  useGetTagsQuery,
  useLazyGetUnitOfMeasurementsQuery,
  useGetCategoriesQuery,
} from '@/store/api/administration/administration.api';
// // import ClassificationSelector from './classification-selector';

const itemSchema: ZodType<Partial<any>> = z.object({
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
  itemSubcategoryName: z.string({
    required_error: 'Item Category is required',
  }),
  itemSubcategoryId: z.string({
    required_error: 'Item Category is required',
  }),
  itemTags: z.array(
    z.string({
      required_error: 'Item Tags is required',
    }),
  ),
});

export function NewItem() {
  const {
    handleSubmit,
    reset,
    register,
    setValue,
    control,
    formState: { errors },
    watch,
  } = useForm<Partial<any>>({
    resolver: zodResolver(itemSchema),
  });
  // const { id } = useParams();

  const { data: measurements, isLoading: isMeasurementLoading } =
    useGetMeasurementsQuery({} as any);

  const { data: categories, isLoading: isCategoriesLoading } =
    useGetCategoriesQuery({
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
  const { data: tags, isLoading: isTagLoading } = useGetTagsQuery({} as any);
  const [
    getUnitOfMeasurements,
    {
      data: unitOfMeasurements,
      isLoading: isGettingUnitOfmeasurements,
      isSuccess: isUnitOfMeasurementsSuccess,
    },
  ] = useLazyGetUnitOfMeasurementsQuery();

  const onCreate = async (data) => {
    // const rawData = {
    //   ...data,
    //   itemTags: data.itemTags.map((tags) => ({ tagId: tags })),
    // };
    try {
      notifications.show({
        color: 'green',
        message: 'Success-fully created',
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

  const onReset = async () => {
    reset({
      commodityCode: '',
      commodityName: '',
      description: '',
      itemSubcategoryName: '',
      itemSubcategoryId: '',
      uOMId: '',
      uOMName: '',
      itemTags: [],
    });
  };

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
        <Flex gap="md" align="end">
          <TextInput
            label="Item Code"
            value={'itemCode'}
            disabled
            className="w-full"
          />
          <Button>Generate</Button>
        </Flex>

        <Textarea
          label="Description"
          withAsterisk
          autosize
          minRows={2}
          maxRows={10}
          {...register('description')}
          error={errors?.description?.message as string | undefined}
        />
        <Tree
          fieldNames={{ title: 'name', key: 'id' }}
          mode="select"
          label="Item Category"
          data={categories?.items ?? []}
          url={(id) =>
            `${
              process.env.NEXT_PUBLIC_ADMINISTRATION_API ??
              '/administration/api/'
            }item-categories?q=w%3DparentId%3A%3D%3A${id}`
          }
          onDone={(item: any) => {
            setValue('itemSubcategoryName', item?.name);
            setValue('itemSubcategoryId', item?.id);
          }}
          placeholder="Select category"
          selectedKeys={{
            id: watch('itemSubcategoryId'),
            name: watch('itemSubcategoryName'),
          }}
          error={errors.itemSubcategoryName?.message as string | null}
          required
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
                error={errors.uOMName?.message as string | undefined}
              />
            )}
          />
        </Flex>
        {/* <ClassificationSelector
          onDone={(item) => {
            setValue('commodityName', item.title);
            setValue('commodityCode', item.code);
          }}
          selectedData={{
            id: watch('commodityCode'),
            name: watch('commodityName'),
          }}
          error={errors.commodityName?.message as string | null}
        /> */}

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
          mode={'new'}
          onCreate={handleSubmit(onCreate)}
          onReset={onReset}
        />
      </Stack>
    </Box>
  );
}
