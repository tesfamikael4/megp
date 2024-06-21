import {
  LoadingOverlay,
  NativeSelect,
  Stack,
  Select,
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
} from '@/app/(features)/preparation/_api/item/technical-requirement.api';
import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { logger, notify } from '@megp/core-fe';
import { TechnicalRequirement } from '@/models/tender/lot/item/technical-requirement.model';
import { RequirementCondition } from '@/models/tender/lot/technical-scoring.model';
import { useReadQuery as useGetSpd } from '@/app/(features)/preparation/_api/tender/tender-spd.api';
import { useLazyListByIdQuery } from '@/app/(features)/preparation/_api/lot/bid-form.api';

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
    bidFormId: z.string().min(1, { message: 'This field is required' }),
  });

  const {
    handleSubmit,
    reset,
    formState: { errors },
    control,
    register,
  } = useForm({
    resolver: zodResolver(spdSchema),
  });
  useEffect(() => {
    logger.log(errors);
  }, [errors]);
  const { itemId, id } = useParams();

  const [create, { isLoading: isSaving }] = useCreateMutation();
  const [update, { isLoading: isUpdating }] = useUpdateMutation();
  const [remove, { isLoading: isDeleting }] = useDeleteMutation();

  const {
    data: selectedSpd,
    isSuccess: isSpdSuccess,
    isLoading: isSpdLoading,
  } = useGetSpd(id?.toString());
  const [trigger, { data: bidFormLinks, isLoading: isBidFormLoading }] =
    useLazyListByIdQuery();
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
    if (isSpdSuccess && selectedSpd) {
      trigger({
        id: selectedSpd.spdId,
        collectionQuery: { where: [] },
      });
    }
  }, [isSpdSuccess, selectedSpd, trigger]);

  useEffect(() => {
    if (mode == 'detail' && selectedSuccess && selected !== undefined) {
      reset({
        category: selected?.category,
        requirement: selected?.requirement,
        requirementCondition: selected?.requirementCondition,
        requirementType: selected?.requirementType,
        bidFormId: selected?.bidFormId,
      });
    }
  }, [mode, reset, selected, selectedSuccess]);

  return (
    <Stack pos="relative">
      <LoadingOverlay visible={isLoading || isBidFormLoading || isSpdLoading} />
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
        <Controller
          control={control}
          name="requirementCondition"
          render={({ field: { value, name, onChange } }) => (
            <Select
              data={Object.values(RequirementCondition)}
              error={
                errors['requirementCondition']
                  ? errors['requirementCondition']?.message?.toString()
                  : ''
              }
              label="Requirement condition"
              withAsterisk
              name={name}
              className="w-1/2"
              nothingFoundMessage="No options"
              onChange={onChange}
              placeholder="Requirement condition"
              searchable
              value={value}
            />
          )}
        />

        <Controller
          control={control}
          name="requirementType"
          render={({ field: { value, name, onChange } }) => (
            <Select
              data={['minimum', 'exact']}
              error={
                errors?.requirementType
                  ? errors?.requirementType?.message?.toString()
                  : ''
              }
              label="Requirement Type"
              withAsterisk
              name={name}
              className="w-1/2"
              nothingFoundMessage="No options"
              onChange={onChange}
              placeholder="Requirement Type"
              searchable
              value={value}
            />
          )}
        />
      </div>

      <Controller
        name="bidFormId"
        control={control}
        render={({ field: { name, value, onChange } }) => (
          <Select
            placeholder="Bid Form Link"
            className="w-1/2"
            label="Bid Form Link"
            value={value}
            data={
              bidFormLinks?.items
                ? bidFormLinks?.items.map((link) => ({
                    label: link.title,
                    value: link.id,
                  }))
                : []
            }
            onChange={(d) => onChange(d)}
            error={
              errors?.bidFormId ? errors?.bidFormId?.message?.toString() : ''
            }
          />
        )}
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
