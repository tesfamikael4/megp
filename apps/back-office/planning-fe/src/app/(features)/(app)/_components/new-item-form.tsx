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

import { Controller, useForm } from 'react-hook-form';
import { ZodType, z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { MantineTree, TreeConfig, logger } from '@megp/core-fe';
import {
  useGetMeasurementsQuery,
  useGetTagsQuery,
  useLazyGetUnitOfMeasurementsQuery,
  useLazyGetCategoriesQuery,
} from '@/store/api/administration/administration.api';
import ClassificationSelector from './classification-selector';
import { useDisclosure } from '@mantine/hooks';

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

export function NewItem({ onDone }: any) {
  const {
    handleSubmit,
    setValue,
    control,
    formState: { errors },
    watch,
  } = useForm<Partial<any>>({
    resolver: zodResolver(itemSchema),
  });
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedCategories, setSelectedCategories] = useState<any[]>([]);
  const treeConfig: TreeConfig<any> = {
    id: 'itemSubcategoryId',
    label: 'itemSubcategoryName',
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
              value: data.itemSubcategoryId,
              operator: 'ILIKE',
            },
          ],
        ],
      }).unwrap();
      return {
        result:
          res?.items?.map((c) => ({
            itemSubcategoryName: c.name,
            itemSubcategoryId: c.id,
          })) ?? [],
        loading: isCategoriesLoading,
      };
    },
  };

  const { data: measurements, isLoading: isMeasurementLoading } =
    useGetMeasurementsQuery({} as any);

  const [getCategories, { data: categories, isLoading: isCategoriesLoading }] =
    useLazyGetCategoriesQuery();
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
    const rawData = {
      ...data,
      itemTags: data.itemTags.map((tags) => ({ tagId: tags })),
      itemCode: '1234-5678',
    };

    onDone(rawData);
  };

  useEffect(() => {
    if (selectedCategories.length > 0) {
      const temp = selectedCategories[selectedCategories.length - 1];
      logger.log({ temp });
      setValue('itemSubcategoryName', temp.itemSubcategoryName);
      setValue('itemSubcategoryId', temp.itemSubcategoryId);
    }
  }, [selectedCategories, setValue]);

  useEffect(() => {
    const id: string | undefined = watch('measurementId');
    if (id) {
      getUnitOfMeasurements(id);
    }
  }, [getUnitOfMeasurements, watch('measurementId')]);

  useEffect(() => {
    if (opened) {
      getCategories({
        where: [
          [
            {
              column: 'parentId',
              value: 'IsNull',
              operator: 'IsNull',
            },
            {
              column: 'parentId',
              value: '',
              operator: '=',
            },
          ],
        ],
      });
    }
  }, [getCategories, opened]);

  return (
    <Box pos="relative">
      <LoadingOverlay
        visible={isMeasurementLoading || isTagLoading || isCategoriesLoading}
      />
      <Stack>
        <Controller
          control={control}
          name="description"
          render={({ field }) => (
            <Textarea
              label="Description"
              withAsterisk
              {...field}
              autosize
              minRows={2}
              maxRows={10}
              error={errors?.description?.message as string}
            />
          )}
        />
        <TextInput
          label="Item Category"
          withAsterisk
          readOnly
          value={watch('itemSubcategoryName')}
          error={errors.itemSubcategoryName?.message as string}
          onClick={open}
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

        <Button
          className="w-fit"
          onClick={handleSubmit(onCreate, (err) => {
            logger.log({ err });
          })}
        >
          Add
        </Button>
      </Stack>

      <Modal title="Item Category" opened={opened} onClose={close} size="lg">
        <Box className="max-h-[30rem] overflow-auto">
          <MantineTree
            config={treeConfig}
            data={
              categories?.items?.map((c) => ({
                itemSubcategoryName: c.name,
                itemSubcategoryId: c.id,
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
