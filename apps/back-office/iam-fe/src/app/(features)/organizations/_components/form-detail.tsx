import {
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
  useListQuery,
} from '../_api/organization.api';
import { useListQuery as useListTypeQuery } from '../../organization-type/_api/organization-type.api';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { Organization } from '@/models/organization';
import { logger, notify } from '@megp/core-fe';

interface FormDetailProps {
  mode: 'new' | 'detail';
}

const defaultValues = {
  name: '',
  typeId: null,

  shortName: '',
  description: '',
};

export function FormDetail({ mode }: FormDetailProps) {
  const organizationSchema: ZodType<Partial<Organization>> = z.object({
    name: z.string().min(1, { message: 'This field is required' }),
    typeId: z.string({
      required_error: 'This field is required',
      invalid_type_error: 'This field is required to be a string',
    }),
    code: z.string().optional(),

    shortName: z
      .string()
      .min(1, { message: 'This field is required' })
      .refine(
        (value) => {
          const organizationsList = list?.items;
          const isUnique =
            organizationsList &&
            organizationsList.every((org) => org.shortName !== value);
          return isUnique;
        },
        {
          message:
            'Short name must be unique among existing organization short names',
        },
      ),
    description: z.string().optional(),
  });

  const {
    handleSubmit,
    reset,
    formState: { errors },
    control,
    register,
  } = useForm({
    resolver: zodResolver(organizationSchema),
  });
  const router = useRouter();
  const { id } = useParams();

  const [create, { isLoading: isSaving }] = useCreateMutation();
  const { data: list } = useListQuery();
  const [update, { isLoading: isUpdating }] = useUpdateMutation();
  const [remove, { isLoading: isDeleting }] = useDeleteMutation();
  const [activation, { isLoading: isActivating }] = useUpdateMutation();

  const {
    data: selected,
    isSuccess: selectedSuccess,
    isLoading,
  } = useReadQuery(id?.toString());

  const { data: orgType } = useListTypeQuery();

  const onCreate = async (data) => {
    try {
      const result = await create(data);
      if ('data' in result) {
        router.push(`/organizations/${result.data.id}`);
      }
      notify('Success', 'Organization created successfully');
    } catch (err) {
      notify('Error', 'Error in creating organization');
    }
  };

  const onUpdate = async (data) => {
    try {
      await update({ ...data, id: id?.toString() });
      notify('Success', 'Organization updated successfully');
    } catch {
      notify('Error', 'Error in updating organization');
    }
  };
  const onDelete = async () => {
    try {
      await remove(id?.toString());
      notify('Success', 'Organization  deleted successfully');
      router.push('/organizations');
    } catch {
      notify('Error', 'Error in deleting organization');
    }
  };
  const onActivate = async () => {
    const dataSent = {
      ...selected,
      isActive: !selected?.isActive,
    };
    try {
      await activation({ ...dataSent, id: id?.toString() });
      notify(
        'Success',
        `organization ${
          selected?.isActive ? 'Deactivated' : 'Activated'
        } successfully`,
      );
    } catch {
      notify(
        'Error',
        `error in ${
          selected?.isActive ? 'Deactivating' : 'Activating'
        }  organization`,
      );
    }
  };

  const onReset = async () => {
    reset({ ...defaultValues });
  };

  useEffect(() => {
    if (mode == 'detail' && selectedSuccess && selected !== undefined) {
      reset({
        name: selected?.name,
        code: selected?.code,
        shortName: selected?.shortName,
        description: selected?.description,
        typeId: selected?.typeId,
      });
    }
  }, [mode, reset, selected, selectedSuccess]);

  return (
    <Stack pos="relative">
      <LoadingOverlay visible={isLoading} />
      <TextInput
        withAsterisk
        label="Name"
        error={errors?.name ? errors?.name?.message?.toString() : ''}
        {...register('name')}
      />
      <TextInput
        withAsterisk
        label="Short name"
        error={errors?.shortName ? errors?.shortName?.message?.toString() : ''}
        required
        {...register('shortName')}
      />

      <Textarea
        label="Description"
        autosize
        minRows={2}
        {...register('description')}
      />

      <Controller
        name="typeId"
        control={control}
        render={({ field: { onChange, value } }) => (
          <Select
            name="name"
            label="Organization Type"
            value={value}
            withAsterisk
            error={errors?.typeId ? errors?.typeId?.message?.toString() : ''}
            onChange={onChange}
            data={
              orgType?.items?.map((type) => ({
                value: type?.id,
                label: type?.name,
              })) || []
            }
          />
        )}
      />

      <EntityButton
        mode={mode}
        data={selected}
        onActivate={handleSubmit(onActivate)}
        onCreate={handleSubmit(onCreate)}
        onUpdate={handleSubmit(onUpdate)}
        onDelete={handleSubmit(onDelete)}
        onReset={onReset}
        isSaving={isSaving}
        isUpdating={isUpdating}
        isDeleting={isDeleting}
        isActivating={isActivating}
      />
    </Stack>
  );
}
