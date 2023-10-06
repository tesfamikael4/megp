import { Flex, Select, Stack, TextInput } from '@mantine/core';
import { EntityButton } from '@megp/entity';

import { Controller, useForm } from 'react-hook-form';
import {
  useDeleteMutation,
  useUpdateMutation,
  useCreateMutation,
  useLazyReadQuery,
} from '../_api/price.api';
import { logger } from '@megp/core-fe';
import { ZodType, z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Price } from '@/models/price';
import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useGetServicesQuery } from '@/store/api/service/service.api';
import { Service } from '@/models/service';
import { notifications } from '@mantine/notifications';

interface FormDetailProps {
  mode: 'new' | 'detail';
}

const pricingSchema: ZodType<Partial<Price>> = z.object({
  serviceId: z.string({
    required_error: 'Service is required',
  }),
  businessArea: z.string({
    required_error: 'Business Area is required',
  }),
  valueTo: z.string({
    required_error: 'To Value is required',
  }),
  valueFrom: z.string({
    required_error: 'From Value is required',
  }),
  fee: z.string({
    required_error: 'Fee is required',
  }),
  currency: z.string({
    required_error: 'Currency is required',
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
  } = useForm<Partial<Price>>({
    resolver: zodResolver(pricingSchema),
  });
  const { id, service, area } = useParams();
  const router = useRouter();

  const [getPrice, { data, isSuccess }] = useLazyReadQuery();

  const [create, { isLoading: isSaving }] = useCreateMutation();
  const [update, { isLoading: isUpdating }] = useUpdateMutation();
  const [remove, { isLoading: isDeleting }] = useDeleteMutation();
  const { data: serviceData, isSuccess: isServiceFetched } =
    useGetServicesQuery({} as any);

  const onCreate = async (data) => {
    const rawData: any = {
      ...data,
      fee: +data.fee,
      valueTo: +data.valueTo,
      valueFrom: +data.valueFrom,
    };

    try {
      const result = await create(rawData).unwrap();
      notifications.show({
        color: 'green',
        message: 'Success-fully created',
        title: 'Success',
      });
      router.push(`/settings/pricing/${service}/${area}/${result.id}`);
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
      router.push(`/settings/pricing/${service}/${area}`);
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
      valueFrom: '',
      valueTo: '',
      fee: '',
      currency: '',
    });
  };

  useEffect(() => {
    if (isServiceFetched) {
      const filteredData: Service[] = serviceData.items.filter(
        (item: Service) => item.key == service,
      );
      setValue(
        'businessArea',
        (area as string).charAt(0).toUpperCase() + (area as string).slice(1),
      );
      setValue('serviceId', filteredData[0]?.id);
    }
  }, []);
  useEffect(() => {
    if (mode == 'detail') {
      getPrice(id as string);
    }
  }, [mode, id, getPrice]);

  useEffect(() => {
    if (mode == 'detail' && isSuccess) {
      setValue('valueFrom', data.valueFrom);
      setValue('valueTo', data.valueTo);
      setValue('fee', data.fee);
      setValue('currency', data.currency);
    }
  }, [mode, isSuccess, data, setValue]);

  return (
    <Stack>
      <Flex gap="md">
        <TextInput
          label="from"
          className="w-full"
          withAsterisk
          type="number"
          {...register('valueFrom')}
          error={errors.valueFrom?.message}
        />
        <TextInput
          label="to"
          className="w-full"
          withAsterisk
          type="number"
          {...register('valueTo')}
          error={errors.valueTo?.message}
        />
      </Flex>

      <Flex gap="md">
        <TextInput
          label="fee"
          className="w-full"
          withAsterisk
          type="number"
          {...register('fee')}
          error={errors.fee?.message}
        />
        <Controller
          name="currency"
          control={control}
          render={({ field: { value, name, onChange } }) => (
            <Select
              name={name}
              value={value}
              onChange={onChange}
              withAsterisk
              label="Currency"
              data={[
                {
                  value: 'MK',
                  label: 'MK',
                },
                {
                  value: 'USD',
                  label: 'USD',
                },
                {
                  value: 'EUR',
                  label: 'EUR',
                },
              ]}
              className="w-full"
              error={errors.currency?.message}
            />
          )}
        />
      </Flex>

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
  );
}
