import {
  LoadingOverlay,
  NativeSelect,
  Stack,
  TextInput,
  Textarea,
} from '@mantine/core';
import { EntityButton } from '@megp/entity';
import { z, ZodType } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  useReadQuery,
  useDeleteMutation,
  useUpdateMutation,
  useCreateMutation,
} from '@/app/(features)/preparation/_api/item/technical-requirement.api';
import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { logger, notify } from '@megp/core-fe';
import { TechnicalRequirement } from '@/models/tender/lot/item/technical-requirement.model';
import { RequirementCondition } from '@/models/tender/lot/technical-scoring.model';

interface FormDetailProps {
  mode: 'new' | 'detail';
  adId: string;
  type: string;
  returnFunction: () => void;
}

export function TechnicalRequirementFormDetail({
  mode,
  adId,
  type,
  returnFunction,
}: Readonly<FormDetailProps>) {
  const spdSchema: ZodType<Partial<TechnicalRequirement>> = z.object({
    category: z.string().min(1, { message: 'This field is required' }),
    requirement: z.string().min(1, { message: 'This field is required' }),
    requirementCondition: z
      .string()
      .min(1, { message: 'This field is required' }),
    requirementType: z.enum(['minimum', 'exact'], {
      required_error: 'This field is required',
    }),
    formLink: z.string().min(1, { message: 'This field is required' }),
  });

  const {
    handleSubmit,
    reset,
    formState: { errors },
    register,
  } = useForm({
    resolver: zodResolver(spdSchema),
  });
  useEffect(() => {
    logger.log(errors);
  }, [errors]);
  const { itemId } = useParams();

  const [create, { isLoading: isSaving }] = useCreateMutation();
  const [update, { isLoading: isUpdating }] = useUpdateMutation();
  const [remove, { isLoading: isDeleting }] = useDeleteMutation();

  const {
    data: selected,
    isSuccess: selectedSuccess,
    isLoading,
  } = useReadQuery(adId?.toString());

  const onCreate = async (data) => {
    logger.log('here');
    try {
      await create({
        ...data,
        itemId: itemId,
        sorType: type,
      });
      returnFunction();
      notify('Success', `${type} created successfully`);
    } catch (err) {
      notify('Error', `Error in creating ${type}`);
    }
  };

  const onUpdate = async (data) => {
    try {
      await update({
        ...data,
        itemId: itemId,
        type: type,
        id: adId?.toString(),
      });
      returnFunction();
      notify('Success', `${type} updated successfully`);
    } catch {
      notify('Error', `Error in updating ${type}`);
    }
  };
  const onDelete = async () => {
    try {
      await remove(adId?.toString());
      returnFunction();
      notify('Success', `${type} deleted successfully`);
    } catch {
      notify('Error', `Error in deleting ${type}`);
    }
  };

  useEffect(() => {
    if (mode == 'detail' && selectedSuccess && selected !== undefined) {
      reset({
        category: selected?.category,
        requirement: selected?.requirement,
        requirementCondition: selected?.requirementCondition,
        requirementType: selected?.requirementType,
        formLink: selected?.formLink,
      });
    }
  }, [mode, reset, selected, selectedSuccess]);

  return (
    <Stack pos="relative">
      <LoadingOverlay visible={isLoading} />
      <Textarea
        label="Requirement"
        withAsterisk
        autosize
        minRows={2}
        error={
          errors?.requirement ? errors?.requirement?.message?.toString() : ''
        }
        {...register('requirement')}
      />
      <TextInput
        label="Category"
        withAsterisk
        error={errors?.category ? errors?.category?.message?.toString() : ''}
        {...register('category')}
      />

      <div className="flex space-x-4">
        <NativeSelect
          placeholder="Requirement condition"
          withAsterisk
          className="w-1/2"
          label="Requirement condition"
          data={Object.values(RequirementCondition)}
          error={
            errors?.requirementCondition
              ? errors?.requirementCondition?.message?.toString()
              : ''
          }
          {...register('requirementCondition')}
        />
        <NativeSelect
          placeholder="Requirement Type"
          withAsterisk
          className="w-1/2"
          label="Requirement requirementType"
          data={['minimum', 'exact']}
          error={
            errors?.requirementType
              ? errors?.requirementType?.message?.toString()
              : ''
          }
          {...register('requirementType')}
        />
      </div>

      <TextInput
        placeholder="Bid Form Link"
        withAsterisk
        label="formLink"
        error={errors?.formLink ? errors?.formLink?.message?.toString() : ''}
        {...register('formLink')}
      />

      <EntityButton
        mode={mode}
        data={selected}
        onCreate={handleSubmit(onCreate)}
        onUpdate={handleSubmit(onUpdate)}
        onDelete={handleSubmit(onDelete)}
        isSaving={isSaving}
        isUpdating={isUpdating}
        isDeleting={isDeleting}
      />
    </Stack>
  );
}
