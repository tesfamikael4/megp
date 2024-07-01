'use client';
import {
  useCreateMutation,
  useUpdateMutation,
} from '@/app/(features)/purchase-order/_api/shipment.api';
import {
  useGetRegionsQuery,
  useLazyGetDistrictsQuery,
} from '@/store/api/rfx/item.api';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
  Flex,
  Group,
  Select,
  TextInput,
  Textarea,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { logger, notify } from '@megp/core-fe';
import { EntityButton } from '@megp/entity';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

interface ShippingType {
  purchaseOrderId: string;
  description: string;
  deliveryLocation: {
    district: string;
  };
  quantity: number;
  uom: string;
  expectedDeliveryDate: Date;
  region: string;
}
export default function ShippingForm({ close }: any) {
  const shippingSchema = z.object({
    description: z.string(),
    deliveryLocation: z.object({
      district: z.string().min(1, { message: 'This field is required' }),
    }),
    quantity: z.coerce.number(),
    uom: z.string().optional(),
    expectedDeliveryDate: z.date(),
  });

  const {
    formState: { errors },
    handleSubmit,
    register,

    control,
  } = useForm<ShippingType>({
    resolver: zodResolver(shippingSchema),
  });

  const { id } = useParams();

  const [selectedRegion, setSelectedRegion] = useState<any>();
  const [selectedDistrict, setSelectedDistrict] = useState<any>();

  const { data: regions } = useGetRegionsQuery(undefined);
  const [triggerDistrict, { data: districts }] = useLazyGetDistrictsQuery();

  const [create, { isLoading: isSaving }] = useCreateMutation();
  const [update, { isLoading: isUpdating }] = useUpdateMutation();

  const onCreate = async (data) => {
    try {
      await create({
        ...data,
        deliveryLocation: {
          districtId: selectedDistrict?.id,
          districtName: selectedDistrict?.name,
          regionId: selectedRegion?.id,
          regionName: selectedRegion?.name,
        },
        purchaseOrderId: id?.toString(),
      }).unwrap();
      notify('Success', 'Created Successfully');
      close();
    } catch {
      notify('Error', 'Error in Creating Shipment');
    }
  };

  const onUpdate = async (data) => {
    try {
      await update({ ...data, id: '' }).unwrap();
      notify('Success', 'Updated Successfully');
    } catch {
      notify('Error', 'Updated Successfully');
    }
  };

  const onError = (err) => {
    logger.log(err);
  };
  logger.log(selectedRegion);

  useEffect(() => {
    selectedRegion !== undefined && triggerDistrict(selectedRegion?.id);
  }, [selectedRegion, triggerDistrict]);

  return (
    <>
      <Flex direction="column" gap="lg">
        <TextInput label="Item" value="Cozy Throw Blanket" disabled />
        <Group grow>
          <Controller
            name="region"
            control={control}
            render={() => (
              <Select
                defaultValue="MW"
                required
                label={'Region'}
                value={selectedRegion?.id}
                onChange={(value) => {
                  const _selectedRegion = regions?.items.filter(
                    (item) => item.id === value,
                  );

                  return setSelectedRegion(_selectedRegion[0]);
                }}
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
            name="deliveryLocation.district"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Select
                defaultValue="MW"
                required
                label={'District'}
                value={value}
                onChange={(value) => {
                  const _selectedItem = districts?.items.filter(
                    (item) => item.id === value,
                  );
                  setSelectedDistrict(_selectedItem[0]);
                  onChange(value);
                }}
                data={
                  districts?.items?.map((item) => ({
                    label: item.name,
                    value: item.id,
                  })) || []
                }
                error={errors.deliveryLocation?.message ?? ''}
                maxDropdownHeight={400}
              />
            )}
          />
        </Group>
        <Group grow>
          <TextInput
            label="Quantity"
            placeholder="Number of items"
            type="number"
            {...register('quantity')}
          />
          <Controller
            name="expectedDeliveryDate"
            control={control}
            render={({ field: { value, onChange } }) => (
              <DateInput
                label="Expected Delivery"
                placeholder="June 15, 2024"
                value={value}
                onChange={onChange}
                minDate={new Date()}
              />
            )}
          />
        </Group>
        <Textarea
          label="Description"
          placeholder="Item Description"
          {...register('description')}
          minRows={4}
          maxRows={4}
        />
      </Flex>
      <Flex justify={'flex-end'} align={'center'} mt="md" gap={'md'}>
        <EntityButton
          mode="new"
          isSaving={isSaving}
          isUpdating={isUpdating}
          onUpdate={handleSubmit(onUpdate)}
          onCreate={handleSubmit(onCreate, onError)}
        />
      </Flex>
    </>
  );
}
