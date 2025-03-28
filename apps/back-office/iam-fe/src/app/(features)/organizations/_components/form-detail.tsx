import {
  Checkbox,
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
  useActivateOrganizationMutation,
} from '@/store/api/organization/organizatin-custom';

import { useLazyListByIdQuery } from '../_api/custom.api';
import { useListQuery as useListTypeQuery } from '../../organization-type/_api/organization-type.api';
import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { Organization } from '@/models/organization';
import { logger, notify } from '@megp/core-fe';
import { useLazySecondRelationQuery } from '../_api/organization-mandate.api';

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
      invalid_type_error: 'This field is required ',
    }),
    code: z.string().optional(),
    shortName: z.string().min(1, { message: 'This field is required' }),
    description: z.string().optional(),
    budgetCheckNeeded: z.boolean(),
    voteCode: z.string({
      required_error: 'This field is required',
      invalid_type_error: 'This field is required ',
    }),
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

  const [trigger, { data: mandateList }] = useLazySecondRelationQuery();
  const [triggerOa, { data: oaList }] = useLazyListByIdQuery();

  const router = useRouter();
  const { id } = useParams();

  const [create, { isLoading: isSaving }] = useCreateMutation();
  const [update, { isLoading: isUpdating }] = useUpdateMutation();
  const [updateActivate, { isLoading: isActivatingUpdate }] =
    useUpdateMutation();
  const [remove, { isLoading: isDeleting }] = useDeleteMutation();
  const [activation, { isLoading: isActivating }] =
    useActivateOrganizationMutation();

  const {
    data: selected,
    isSuccess: selectedSuccess,
    isLoading,
  } = useReadQuery(id?.toString());

  const { data: orgType } = useListTypeQuery({});

  const onCreate = async (data) => {
    try {
      const result = await create(data).unwrap();

      router.push(`/organizations/${result.id}`);

      notify('Success', 'Organization created successfully');
    } catch (err) {
      notify(
        'Error',
        `${
          err.data.message === 'organization already exists'
            ? 'organization already exists'
            : err?.data?.message?.[0].startsWith('Vote')
              ? 'Vote code must at least have three digits'
              : 'Error in creating organization'
        }`,
      );
    }
  };

  const onUpdate = async (data) => {
    try {
      await update({ ...data, id: id?.toString() }).unwrap();
      notify('Success', 'Organization updated successfully');
    } catch (err) {
      notify(
        'Error',
        `${err.data.message.toLowerCase().startsWith('duplicate') ? 'Organization name already exists' : 'Error in updating organization'}`,
      );
    }
  };
  const onDelete = async () => {
    try {
      await remove(id?.toString()).unwrap();
      notify('Success', 'Organization  deleted successfully');
      router.push('/organizations');
    } catch {
      notify('Error', 'Error in deleting organization');
    }
  };
  const onActivate = async () => {
    try {
      selected?.status === 'INACTIVE' || selected?.status === 'Draft'
        ? await activation(id?.toString())
        : await updateActivate({ status: 'INACTIVE', id: id?.toString() });

      notify(
        'Success',
        `Organization ${
          selected?.status === 'ACTIVE' ? 'Deactivated' : 'Activated'
        } successfully`,
      );
    } catch {
      notify(
        'Error',
        `Error in ${
          selected?.status === 'ACTIVE' ? 'Deactivating' : 'Activating'
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
        voteCode: selected?.voteCode,
        budgetCheckNeeded: selected?.budgetCheckNeeded,
      });
    }
  }, [mode, reset, selected, selectedSuccess]);

  useEffect(() => {
    if (id) {
      trigger({
        id: id?.toString(),
        collectionQuery: undefined,
      });
    }
  }, [id, trigger]);

  useEffect(() => {
    if (id) {
      triggerOa(id?.toString());
    }
  }, [id, triggerOa]);

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
        label="Short Name"
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

      <Checkbox
        label="Is Budget Verifications Required"
        className="w-full mt-4 mb-2"
        {...register('budgetCheckNeeded')}
      />

      <Controller
        name="voteCode"
        control={control}
        render={({ field: { name, value, onChange } }) => (
          <TextInput
            label="Vote Code"
            className="w-full"
            name={name}
            value={value ?? ''}
            onChange={onChange}
            error={
              errors?.voteCode ? errors?.voteCode?.message?.toString() : ''
            }
            withAsterisk
            type="number"
          />
        )}
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
        onActivate={
          mandateList?.total !== 0 && oaList?.total !== 0
            ? handleSubmit(onActivate)
            : undefined
        }
        onCreate={handleSubmit(onCreate)}
        onUpdate={handleSubmit(onUpdate)}
        onDelete={handleSubmit(onDelete)}
        onReset={onReset}
        isSaving={isSaving}
        isUpdating={isUpdating}
        isDeleting={isDeleting}
        isActivating={isActivating || isActivatingUpdate}
        entity="organization"
      />
    </Stack>
  );
}
