'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  Button,
  Divider,
  Flex,
  Group,
  NumberInput,
  Select,
  Stack,
  Title,
} from '@mantine/core';
import { IconCirclePlus, IconCross, IconMinus } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ZodType, z } from 'zod';
import {
  useCreateDeliveryLocationMutation,
  useGetRegionsQuery,
  useLazyGetDeliveryLocationQuery,
  useLazyGetDistrictsQuery,
} from '../_api/catalog.api';
import { logger, notify } from '@megp/core-fe';

interface DeliverDays {
  quantity: number;
  deliverDays: number;
  district: string;
}
export const DeliverDaysForm = ({ close }) => {
  const schema: ZodType<Partial<DeliverDays>> = z.object({
    quantity: z.coerce.number().optional(),
    deliverDays: z.coerce.number(),
    district: z.string({
      required_error: 'This field is required',
      invalid_type_error: 'This field is required',
    }),
  });

  const [selectedRegion, setSelectedRegion] = useState<any>();
  const { data: regions } = useGetRegionsQuery(undefined);
  const [triggerDistrict, { data: districts }] = useLazyGetDistrictsQuery();
  const [onCreate] = useCreateDeliveryLocationMutation();
  const [trigger, { data: delivaryLocations, isLoading }] =
    useLazyGetDeliveryLocationQuery();

  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    resolver: zodResolver(schema),
  });

  const handleSave = async (data: any) => {
    try {
      await onCreate(data).unwrap();
      notify('Success', 'Delivery location added successfully');
      close();
    } catch (e) {
      notify('Error', 'Failed to add delivery location');
      close();
    }
  };

  // setSelectedRegion(catalog?.deliveryValues?.[0]?.region);

  useEffect(() => {
    selectedRegion !== undefined && triggerDistrict(selectedRegion);
  }, [selectedRegion, triggerDistrict]);
  const onError = (error) => {
    logger.error(error);
  };

  return (
    <>
      <Box className="w-full p-4">
        <Stack className="w-full ml-2 min">
          <>
            <Controller
              name="region"
              control={control}
              render={() => (
                <Select
                  defaultValue="MW"
                  required
                  label={'Region'}
                  value={selectedRegion}
                  onChange={(value) => setSelectedRegion(value)}
                  error={
                    (selectedRegion === null || selectedRegion === '') &&
                    'This field is required'
                  }
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
              name="district"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Select
                  defaultValue="MW"
                  required
                  label={'District'}
                  value={value}
                  onChange={onChange}
                  data={
                    districts?.items?.map((item) => ({
                      label: item.name,
                      value: item.id,
                    })) || []
                  }
                  error={errors.district?.message?.toString() ?? ''}
                  maxDropdownHeight={400}
                />
              )}
            />
            <Controller
              name="deliverDays"
              control={control}
              render={({ field: { name, value, onChange } }) => (
                <NumberInput
                  label={'Delivery Days'}
                  withAsterisk
                  value={value}
                  onChange={onChange}
                  error={errors?.deliverDays?.message?.toString() ?? ''}
                />
              )}
            />
            <Controller
              name="quantity"
              control={control}
              render={({ field: { value, onChange } }) => (
                <NumberInput
                  label={'Quantity'}
                  value={value}
                  onChange={onChange}
                  error={errors?.quantity?.message?.toString() ?? ''}
                />
              )}
            />

            <Divider my={'md'} />
          </>

          <Group className="ml-auto pe-4">
            <Button onClick={handleSubmit(handleSave, onError)}>Save</Button>
          </Group>
        </Stack>
      </Box>
    </>
  );
};
