import {
  Container,
  LoadingOverlay,
  Select,
  Stack,
  TextInput,
  Textarea,
} from '@mantine/core';
import { EntityButton } from '@megp/entity';
import { z, ZodType } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import {
  useReadQuery,
  useDeleteMutation,
  useUpdateMutation,
  useCreateMutation,
} from '@/app/(features)/procurement-requisition/_api/procurement-requisition.api';
import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { ProcurementRequisition } from '@/models/procurement-requsition';
import { notify } from '@megp/core-fe';

interface FormDetailProps {
  mode: 'new' | 'detail';
}

const defaultValues = {
  title: '',
  description: '',
};

export function FormDetail({ mode }: FormDetailProps) {
  const organizationSchema: ZodType<Partial<ProcurementRequisition>> = z.object(
    {
      title: z.string().min(1, { message: 'This field is required' }),
      description: z.string().optional(),
    },
  );

  const {
    handleSubmit,
    reset,
    formState: { errors },
    register,
  } = useForm({
    resolver: zodResolver(organizationSchema),
  });
  const router = useRouter();
  const { id } = useParams();

  const [create, { isLoading: isSaving }] = useCreateMutation();
  const [update, { isLoading: isUpdating }] = useUpdateMutation();
  const [remove, { isLoading: isDeleting }] = useDeleteMutation();

  const {
    data: selected,
    isSuccess: selectedSuccess,
    isLoading,
  } = useReadQuery(id?.toString());

  const onCreate = async (data) => {
    const sent = {
      ...data,
      organization: {},
      budgetYear: {
        budgetYearId: 'string',
        budgetYear: 'string',
      },
      currency: 'string',
    };
    try {
      const result = await create(sent);
      if ('data' in result) {
        router.push(`/procurement-requisition/${result.data.id}`);
      }
      notify('Success', 'Procurement requisition created successfully');
    } catch (err) {
      notify('Error', 'Error in creating organization');
    }
  };

  const onUpdate = async (data) => {
    try {
      await update({ ...data, id: id?.toString() });
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
      });
    }
  }, [mode, reset, selected, selectedSuccess]);

  return (
    <Stack pos="relative">
      {mode == 'detail' && <LoadingOverlay visible={isLoading} />}
      <TextInput
        withAsterisk
        label="Title"
        error={errors?.title ? errors?.title?.message?.toString() : ''}
        {...register('title')}
      />

      <Textarea
        label="Description"
        autosize
        minRows={2}
        {...register('description')}
      />

      <EntityButton
        mode={mode}
        data={selected}
        onCreate={handleSubmit(onCreate)}
        onUpdate={handleSubmit(onUpdate)}
        onDelete={handleSubmit(onDelete)}
        onReset={onReset}
        isSaving={isSaving}
        isUpdating={isUpdating}
        isDeleting={isDeleting}
        entity="organization"
      />
    </Stack>
  );
}
