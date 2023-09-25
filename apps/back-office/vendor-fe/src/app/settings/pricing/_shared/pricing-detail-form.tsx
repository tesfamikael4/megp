import {
  Box,
  Button,
  Flex,
  LoadingOverlay,
  Popover,
  Select,
  Text,
  TextInput,
} from '@mantine/core';
import { IconDeviceFloppy, IconTrash } from '@tabler/icons-react';
import { z } from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  useAddPricesMutation,
  useDeletePricesMutation,
  useGetServicesQuery,
  useLazyGetPriceByIdQuery,
  useUpdatePriceMutation,
} from '@/store/api/pricing/pricing.api';
import { notifications } from '@mantine/notifications';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

type PricingDetailFormProps = {
  mode: 'new' | 'update';
};

const ServiceFeeSchema = z.object({
  serviceId: z.string({
    required_error: 'Service is required',
  }),
  businessArea: z.string({
    required_error: 'Business Area is required',
  }),
  valueFrom: z.string({
    required_error: 'Value from is required',
  }),
  valueTo: z.string({
    required_error: 'Value to is required',
  }),
  fee: z.string({
    required_error: 'Fee is required',
  }),
  currency: z.string({
    required_error: 'currency is required',
  }),
});

type ServiceFeeType = z.infer<typeof ServiceFeeSchema>;

export const PricingDetailForm = (props: PricingDetailFormProps) => {
  const { id } = useParams();
  const router = useRouter();
  const {
    data: service,
    isLoading: isServiceLoading,
    isSuccess: isServiceFeached,
  } = useGetServicesQuery();
  const [addPrice, { isLoading: isAdding }] = useAddPricesMutation();
  const [updatePrice, { isLoading: isUpdating }] = useUpdatePriceMutation();
  const [deletePrice, { isLoading: isDeleting }] = useDeletePricesMutation();
  const [getServiceById, { data, isLoading, isSuccess }] =
    useLazyGetPriceByIdQuery();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm<ServiceFeeType>({
    resolver: zodResolver(ServiceFeeSchema),
  });

  //helper fn's
  const onSubmit = async (data: ServiceFeeType) => {
    const rawD = {
      ...data,
      fee: parseInt(data.fee),
      valueFrom: parseInt(data.valueFrom),
      valueTo: parseInt(data.valueTo),
    };
    try {
      if (props.mode == 'new') {
        const res = await addPrice(rawD).unwrap();
        notifications.show({
          color: 'green',
          message: 'Price created Success-fully',
        });
        router.push(`/settings/pricing/detail/${res.id}`);
      }
      if (props.mode == 'update') {
        const res = await updatePrice({ price: rawD, id }).unwrap();
        notifications.show({
          color: 'green',
          message: 'Price Updated Success-fully',
        });
      }
    } catch (err) {
      notifications.show({
        color: 'red',
        message: 'Something went wrong',
      });
    }
  };
  const onError = (data) => {
    console.log(data);
  };

  const onDelete = async () => {
    try {
      const res = await deletePrice(id).unwrap;
      notifications.show({
        color: 'green',
        message: 'Price Delete Success-fully',
        title: 'Price Deleted',
      });
      router.push('/settings/pricing');
    } catch (err) {
      notifications.show({
        color: 'red',
        message: 'Something Went Wrong',
        title: 'Error',
      });
    }
  };

  //hooks
  useEffect(() => {
    if (props.mode == 'update') {
      getServiceById(id);
    }
  }, []);

  useEffect(() => {
    if (props.mode == 'update' && isSuccess) {
      setValue('valueFrom', data.valueFrom);
      setValue('serviceId', data.serviceId);
      setValue('valueTo', data.valueTo);
      setValue('businessArea', data.businessArea);
      setValue('fee', data.fee);
      setValue('currency', data.currency);
    }
  }, [isSuccess, props.mode, setValue, data]);
  return (
    <Box>
      <LoadingOverlay visible={isServiceLoading || isLoading} />
      <form className="py-5" onClick={handleSubmit(onSubmit, onError)}>
        <Flex gap="lg">
          <Controller
            name="serviceId"
            control={control}
            render={({ field: { value, name, onChange } }) => (
              <Select
                value={value}
                name={name}
                onChange={onChange}
                label="Service"
                data={
                  isServiceFeached
                    ? service?.items?.map((d: any) => {
                        return {
                          value: d.id,
                          label: d.description,
                        };
                      })
                    : []
                }
                className="w-full"
                withAsterisk
                maxDropdownHeight={150}
                error={errors.serviceId?.message}
              />
            )}
          />
          <Controller
            name="businessArea"
            control={control}
            render={({ field: { value, name, onChange } }) => (
              <Select
                value={value}
                name={name}
                onChange={onChange}
                label="Business Area"
                data={[
                  { value: 'Goods', label: 'Goods' },
                  { value: 'Services', label: 'Services' },
                  { value: 'Works', label: 'Works' },
                ]}
                className="w-full"
                withAsterisk
                maxDropdownHeight={150}
                error={errors.businessArea?.message}
              />
            )}
          />
        </Flex>
        <Flex gap="lg" className="mt-3">
          <Controller
            name="valueFrom"
            control={control}
            render={({ field: { value, name, onChange } }) => (
              <TextInput
                value={value}
                name={name}
                onChange={onChange}
                type="number"
                label="Value from"
                className="w-full"
                withAsterisk
                // {...register('valueFrom')}
                error={errors.valueFrom?.message}
                // required
              />
            )}
          />

          <Controller
            name="valueTo"
            control={control}
            render={({ field: { value, name, onChange } }) => (
              <TextInput
                value={value}
                name={name}
                onChange={onChange}
                type="number"
                label="Value to"
                className="w-full"
                withAsterisk
                // {...register('valueTo')}
                error={errors.valueTo?.message}
                // required
              />
            )}
          />
        </Flex>

        <Flex gap="lg" className="mt-3">
          <Controller
            name="fee"
            control={control}
            render={({ field: { value, name, onChange } }) => (
              <TextInput
                type="number"
                value={value}
                name={name}
                onChange={onChange}
                label="Fee"
                className="w-full"
                withAsterisk
                // {...register('fee')}
                error={errors.fee?.message}
                // required
              />
            )}
          />
          <Controller
            name="currency"
            control={control}
            render={({ field: { value, name, onChange } }) => (
              <Select
                name={name}
                value={value}
                onChange={onChange}
                label="Currency"
                data={[
                  { value: 'MWK', label: 'MWK' },
                  { value: 'USD', label: 'USD' },
                  { value: 'EUR', label: 'EUR' },
                  { value: 'GBP', label: 'GBP' },
                ]}
                className="w-full"
                withAsterisk
                maxDropdownHeight={150}
                error={errors.currency?.message}
              />
            )}
          />
        </Flex>

        {props.mode == 'new' && (
          <Button className="mt-3" type="submit" loading={isAdding}>
            <IconDeviceFloppy /> Save
          </Button>
        )}
        {props.mode == 'update' && (
          <>
            <Button className="mt-3" type="submit" loading={isUpdating}>
              <IconDeviceFloppy /> Update
            </Button>
            <Popover>
              <Popover.Target>
                <Button className="mt-3 ml-2" color="red" loading={isAdding}>
                  <IconTrash /> Delete
                </Button>
              </Popover.Target>
              <Popover.Dropdown>
                <Text fw="bold">Do you want to delete this price?</Text>
                <Button
                  className="mt-3 ml-2"
                  color="red"
                  onClick={onDelete}
                  loading={isDeleting}
                >
                  Yes
                </Button>
                <Button className="mt-3 ml-2">No</Button>
              </Popover.Dropdown>
            </Popover>
          </>
        )}
      </form>
    </Box>
  );
};
