import {
  LoadingOverlay,
  NativeSelect,
  NumberInput,
  Select,
  Stack,
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
} from '@/app/(features)/preparation/_api/lot/technical-scoring.api';
import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { notify } from '@megp/core-fe';
import {
  RequirementCondition,
  TechnicalScoring,
} from '@/models/tender/lot/technical-scoring.model';
import { useReadQuery as useGetSpd } from '@/app/(features)/preparation/_api/tender/tender-spd.api';
import { useLazyListByIdQuery } from '@/app/(features)/preparation/_api/lot/bid-form.api';

interface FormDetailProps {
  mode: 'new' | 'detail';
  parentId?: string;
  lotId: string;
  returnFunction: () => void;
}

export function TechnicalScoringFormDetail({
  mode,
  parentId,
  lotId,
  returnFunction,
}: FormDetailProps) {
  const { id } = useParams();
  const spdSchema: ZodType<Partial<TechnicalScoring>> = z.object({
    requirement: z.string().min(1, { message: 'This field is required' }),
    bidFormId: z.string().min(1, { message: 'This field is required' }),
    requirementCondition: z.string(),
    point: z.number({ required_error: 'This field is required' }),
  });

  const {
    handleSubmit,
    reset,
    formState: { errors },
    register,
    control,
  } = useForm({
    resolver: zodResolver(spdSchema),
  });
  const {
    data: selectedSpd,
    isSuccess: isSpdSuccess,
    isLoading: isSpdLoading,
  } = useGetSpd(id?.toString());

  const [create, { isLoading: isSaving }] = useCreateMutation();
  const [update, { isLoading: isUpdating }] = useUpdateMutation();
  const [remove, { isLoading: isDeleting }] = useDeleteMutation();

  const {
    data: selected,
    isSuccess: selectedSuccess,
    isLoading,
  } = useReadQuery(parentId ? parentId?.toString() : '');

  const [trigger, { data: bidFormLinks, isLoading: isBidFormLoading }] =
    useLazyListByIdQuery();

  const onCreate = async (data) => {
    try {
      await create({
        ...data,
        lotId: lotId,
        parentId: parentId ?? null,
        isProfessional: false,
        hasProfessional: false,
        isRequired: false,
        validation: { min: 0, max: 100 },
      });
      notify('Success', 'technical scoring created successfully');
      returnFunction();
    } catch (err) {
      notify('Error', 'Error in creating technical scoring');
    }
  };

  const onUpdate = async (data) => {
    try {
      await update({ ...data, id: id?.toString(), spdId: id });
      notify('Success', 'technical scoring updated successfully');
      returnFunction();
    } catch {
      notify('Error', 'Error in updating technical scoring');
    }
  };
  const onDelete = async () => {
    try {
      await remove(id?.toString());
      notify('Success', 'technical scoring  deleted successfully');
      returnFunction();
    } catch {
      notify('Error', 'Error in deleting technical scoring');
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
        requirement: selected?.requirement,
        point: selected?.point,
        bidFormId: selected?.bidFormId,
        requirementCondition: selected?.requirementCondition,
        validation: selected?.validation,
      });
    }
  }, [mode, reset, selected, selectedSuccess]);

  return (
    <Stack pos="relative">
      <LoadingOverlay
        visible={
          isLoading ||
          isUpdating ||
          isSaving ||
          isSpdLoading ||
          isBidFormLoading
        }
      />
      <Textarea
        label="Criteria"
        withAsterisk
        autosize
        minRows={2}
        error={
          errors?.requirement ? errors?.requirement?.message?.toString() : ''
        }
        {...register('requirement')}
      />
      <div className="flex space-x-4">
        <Controller
          name="point"
          control={control}
          render={({ field: { name, value, onChange } }) => (
            <NumberInput
              label="Point"
              name={name}
              value={value}
              min={selected ? selected?.validation?.min : 0}
              max={selected ? selected?.validation?.max : 0}
              className="w-1/2"
              onChange={(d) => onChange(parseInt(d as string))}
              error={
                errors['point'] ? errors['point']?.message?.toString() : ''
              }
              withAsterisk
            />
          )}
        />

        <NativeSelect
          placeholder="Requirement condition"
          withAsterisk
          className="w-1/2"
          label="Requirement condition"
          data={Object.values(RequirementCondition)}
          {...register('requirementCondition')}
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
