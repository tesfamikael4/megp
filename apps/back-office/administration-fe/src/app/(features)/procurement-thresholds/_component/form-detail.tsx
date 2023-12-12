import {
  LoadingOverlay,
  NumberInput,
  Select,
  Stack,
  TextInput,
} from '@mantine/core';
import { EntityButton } from '@megp/entity';
import { z, ZodType } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { notifications } from '@mantine/notifications';
import { Controller, useForm } from 'react-hook-form';
import {
  useCreateMutation,
  useDeleteMutation,
  useReadQuery,
  useUpdateMutation,
} from '../_api/procurement-thresholds.api';
import { ProcurementThreshold } from '@/models/procurement-threshold';

interface FormDetailProps {
  mode: 'new' | 'detail';
}

const defaultValues = {
  procurementType: '',
  minThreshold: 0,
  maxThreshold: 0,
  procurementMethod: '',
};

export function FormDetail({ mode }: FormDetailProps) {
  const procurementThresholdSchema: ZodType<Partial<ProcurementThreshold>> =
    z.object({
      procurementType: z.string().min(1, { message: 'This field is required' }),
      minThreshold: z.number().min(1, { message: 'This field is required' }),
      maxThreshold: z.number().min(1, { message: 'This field is required' }),
      procurementMethod: z
        .string()
        .min(1, { message: 'This field is required' }),
    });

  const {
    handleSubmit,
    reset,
    formState: { errors },
    control,
  } = useForm({
    resolver: zodResolver(procurementThresholdSchema),
  });
  const router = useRouter();
  const { id } = useParams();

  const [create, { isLoading: isSaving }] = useCreateMutation();
  const [update, { isLoading: isUpdating }] = useUpdateMutation();
  const [remove, { isLoading: isDeleting }] = useDeleteMutation();
  const { data: selected, isSuccess: selectedSuccess } = useReadQuery(
    id?.toString(),
  );

  const onCreate = async (data) => {
    try {
      const result = await create(data);
      if ('data' in result) {
        router.push(`/procurement-thresholds/${result?.data?.id}`);
      }
      notifications.show({
        message: 'Threshold created successfully',
        title: 'Success',
        color: 'green',
      });
    } catch (err) {
      notifications.show({
        message: 'errors in deleting threshold.',
        title: 'Error',
        color: 'red',
      });
    }
  };
  const onUpdate = async (data) => {
    try {
      await update({ ...data, id: id?.toString() });
      notifications.show({
        message: 'Threshold updated successfully',
        title: 'Success',
        color: 'green',
      });
    } catch {
      notifications.show({
        color: 'red',
        message: 'errors in creating threshold.',
        title: 'Error',
      });
    }
  };
  const onDelete = async () => {
    try {
      await remove(id?.toString()).unwrap();
      notifications.show({
        message: 'Threshold deleted successfully',
        title: 'Success',
        color: 'green',
      });
      router.push('/procurement-thresholds');
    } catch (err) {
      notifications.show({
        message: 'errors in deleting threshold.',
        title: 'Error',
        color: 'red',
      });
    }
  };

  const onReset = async () => {
    reset({ ...defaultValues });
  };

  useEffect(() => {
    if (mode == 'detail' && selectedSuccess && selected !== undefined) {
      reset({
        procurementType: selected?.procurementType,
        minThreshold: selected?.minThreshold,
        maxThreshold: selected?.maxThreshold,
        procurementMethod: selected?.procurementMethod,
      });
    }
  }, [mode, reset, selected, selectedSuccess]);

  return (
    <Stack pos="relative">
      <Controller
        name="procurementType"
        control={control}
        render={({ field: { value, name, onChange } }) => (
          <Select
            withCheckIcon={false}
            name={name}
            value={value}
            onChange={onChange}
            label="Procurement Type"
            data={[
              'Works',
              'Goods',
              'Services',
              'Consultancy',
              'Competitive Bidding  ',
              'Motor Vechicle Repair',
            ]}
            className="w-full"
            withAsterisk
            placeholder="Select Procurement Type"
            error={
              errors?.procurementType
                ? errors?.procurementType?.message?.toString()
                : ''
            }
          />
        )}
      />
      <Controller
        name="minThreshold"
        control={control}
        render={({ field: { name, value, onChange } }) => (
          <NumberInput
            label="Min Threshold"
            name={name}
            value={value}
            onChange={(d) => onChange(parseInt(d as string))}
            className="w-full"
            error={
              errors?.minThreshold
                ? errors?.minThreshold?.message?.toString()
                : ''
            }
            withAsterisk
          />
        )}
      />
      <Controller
        name="maxThreshold"
        control={control}
        render={({ field: { name, value, onChange } }) => (
          <NumberInput
            label="Max Threshold"
            name={name}
            value={value}
            onChange={(d) => onChange(parseInt(d as string))}
            className="w-full"
            error={
              errors?.maxThreshold
                ? errors?.maxThreshold?.message?.toString()
                : ''
            }
            withAsterisk
          />
        )}
      />
      <Controller
        name="procurementMethod"
        control={control}
        render={({ field: { value, name, onChange } }) => (
          <Select
            withCheckIcon={false}
            name={name}
            value={value}
            onChange={onChange}
            label="Procurement Method "
            data={[
              'Request for Quotation',
              'National Competitive Bidding  ',
              'International Competitive Bidding',
              'Request for Proposal',
              'Single Sourcing',
              'Restricted Tender',
              'Two-stage Bidding',
              'Framwork Procurement',
              'Purchase Order(Call off)',
            ]}
            className="w-full"
            withAsterisk
            placeholder="Select Procurement Method"
            error={
              errors?.procurementMethod
                ? errors?.procurementMethod?.message?.toString()
                : ''
            }
          />
        )}
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
  );
}
