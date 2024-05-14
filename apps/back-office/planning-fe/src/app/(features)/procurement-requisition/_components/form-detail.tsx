import {
  LoadingOverlay,
  Select,
  Stack,
  TextInput,
  Textarea,
  Flex,
  Box,
} from '@mantine/core';
import { EntityButton } from '@megp/entity';
import { z, ZodType } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import {
  useReadQuery,
  useDeleteMutation,
  useUpdateMutation,
} from '@/app/(features)/procurement-requisition/_api/procurement-requisition.api';
import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { ProcurementRequisition } from '@/models/procurement-requsition';
import { notify } from '@megp/core-fe';
import { DateInput } from '@mantine/dates';

interface FormDetailProps {
  mode: 'new' | 'detail';
}

const defaultValues = {
  title: '',
  description: '',
  procurementType: null,
  deliveryDate: null,
  userReference: '',
};

export function FormDetail({ mode }: FormDetailProps) {
  const organizationSchema: ZodType<Partial<ProcurementRequisition>> = z.object(
    {
      title: z.string().min(1, { message: 'This field is required' }),
      requisitionReferenceNumber: z.string(),
      description: z.string().optional(),
      procurementType: z.string({
        required_error: 'This field is required',
        invalid_type_error: 'This field is required to be a string',
      }),
      deliveryDate: z.date(),
      userReference: z.string().optional(),
    },
  );

  const {
    handleSubmit,
    reset,
    formState: { errors },
    register,
    control,
  } = useForm({
    resolver: zodResolver(organizationSchema),
  });
  const router = useRouter();
  const { id } = useParams();

  const [update, { isLoading: isUpdating }] = useUpdateMutation();
  const [remove, { isLoading: isDeleting }] = useDeleteMutation();

  const {
    data: selected,
    isSuccess: selectedSuccess,
    isLoading,
  } = useReadQuery(id?.toString());

  const onUpdate = async (data) => {
    try {
      await update({
        ...data,
        id: id?.toString(),
      });
      notify('Success', 'Procurement Requisition updated successfully');
    } catch {
      notify('Error', 'Error in updating Procurement Requisition');
    }
  };
  const onDelete = async () => {
    try {
      await remove(id?.toString());
      notify('Success', 'Procurement Requisition  deleted successfully');
      router.push(`/procurement-requisition`);
    } catch {
      notify('Error', 'Error in deleting Procurement Requisition');
    }
  };

  const onReset = async () => {
    reset({ ...defaultValues });
  };

  useEffect(() => {
    if (mode == 'detail' && selectedSuccess && selected !== undefined) {
      reset({
        title: selected?.title,
        description: selected?.description,
        procurementType: selected?.procurementType,
        requisitionReferenceNumber: selected?.requisitionReferenceNumber,
        deliveryDate: new Date(selected?.deliveryDate),
      });
    }
  }, [mode, reset, selected, selectedSuccess]);

  return (
    <Stack pos="relative" pb={'sm'}>
      <Flex gap="md">
        <Box className="w-1/2">
          {mode == 'detail' && <LoadingOverlay visible={isLoading} />}
          <TextInput
            withAsterisk
            disabled
            label="Reference Number"
            {...register('requisitionReferenceNumber')}
          />

          <TextInput
            withAsterisk
            label="Name"
            error={errors?.title ? errors?.title?.message?.toString() : ''}
            {...register('title')}
          />
          <Controller
            name="deliveryDate"
            control={control}
            render={({ field: { onChange, value } }) => (
              <DateInput
                name="name"
                valueFormat="DD-MMM-YYYY"
                withAsterisk
                label="Delivery Date"
                onChange={onChange}
                value={value}
                placeholder="Pick date"
                defaultValue={new Date()}
              />
            )}
          />

          <Controller
            name="procurementType"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Select
                name="name"
                label="Procured By"
                value={value}
                withAsterisk
                error={
                  errors?.procurementType
                    ? errors?.procurementType?.message?.toString()
                    : ''
                }
                onChange={onChange}
                data={[
                  {
                    value: 'Tendering',
                    label: 'Tendering',
                  },
                  {
                    value: 'purchasing',
                    label: 'purchasing',
                  },
                  {
                    value: 'Auctioning',
                    label: 'Auctioning',
                  },
                ]}
              />
            )}
          />

          <TextInput
            label={'userReference'}
            {...register('userReference')}
            error={
              errors?.userReference
                ? errors?.userReference?.message?.toString()
                : ''
            }
          />
        </Box>
        <Box className="w-1/2">
          <Textarea
            label="Description"
            autosize
            minRows={6}
            maxRows={6}
            {...register('description')}
          />
        </Box>
      </Flex>

      <EntityButton
        mode={mode}
        data={selected}
        onUpdate={handleSubmit(onUpdate)}
        onDelete={handleSubmit(onDelete)}
        onReset={onReset}
        isUpdating={isUpdating}
        isDeleting={isDeleting}
        entity="Procurement requisition"
      />
    </Stack>
  );
}
