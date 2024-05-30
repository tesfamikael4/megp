import {
  Checkbox,
  LoadingOverlay,
  NativeSelect,
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
} from '@/app/(features)/preparation/_api/lot/preliminary-examination.api';
import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { logger, notify } from '@megp/core-fe';
import { PreliminaryExamination } from '@/models/tender/lot/preliminary-examination.model';
import { RequirementCondition } from '@/models/tender/lot/technical-scoring.model';
import { useReadQuery as useGetSpd } from '@/app/(features)/preparation/_api/tender/tender-spd.api';
import { useLazyListByIdQuery } from '@/app/(features)/preparation/_api/lot/bid-form.api';

interface FormDetailProps {
  mode: 'new' | 'detail';
  adId: string;
  type: 'technical' | 'financial';
  lotId: string;
  returnFunction: () => void;
}

export function PreliminaryExaminationFormDetail({
  mode,
  adId,
  type,
  lotId,
  returnFunction,
}: Readonly<FormDetailProps>) {
  const preliminaryExaminationSchema: ZodType<Partial<PreliminaryExamination>> =
    z.object({
      criteria: z.string().min(1, { message: 'This field is required' }),
      type: z.enum(['technical', 'financial']).optional(),
      itbDescription: z.string().min(1, { message: 'This field is required' }),
      itbReference: z.string().min(1, { message: 'This field is required' }),
      bidFormId: z.string().min(1, { message: 'This field is required' }),
      requirementCondition: z.enum(
        ['Must meet', 'Has to meet', 'Not applicable'],
        { required_error: 'this field is required' },
      ),
    });

  const {
    handleSubmit,
    reset,
    formState: { errors },
    control,
    register,
  } = useForm({
    resolver: zodResolver(preliminaryExaminationSchema),
  });

  const { id } = useParams();

  const {
    data: selectedSpd,
    isSuccess: isSpdSuccess,
    isLoading: isSpdLoading,
  } = useGetSpd(id?.toString());
  const [trigger, { data: bidFormLinks, isLoading: isBidFormLoading }] =
    useLazyListByIdQuery();
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
        lotId: lotId,
        type: type,
        isRequired: false,
        order: 1,
      });
      notify('Success', 'Preliminary examination created successfully');
      returnFunction();
    } catch (err) {
      notify('Error', 'Error in creating preliminary examination');
    }
  };

  const onUpdate = async (data) => {
    try {
      await update({ ...data, lotId: lotId, type: type, id: adId?.toString() });
      notify('Success', 'Preliminary examination updated successfully');
      returnFunction();
    } catch {
      notify('Error', 'Error in updating preliminary examination');
    }
  };
  const onDelete = async () => {
    try {
      await remove(adId?.toString());
      notify('Success', 'Preliminary examination deleted successfully');
      returnFunction();
    } catch {
      notify('Error', 'Error in deleting preliminary examination');
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
    logger.log(selected);
    if (mode == 'detail' && selectedSuccess && selected !== undefined) {
      reset({
        criteria: selected?.criteria,
        type: selected?.type,
        itbReference: selected?.itbReference,
        bidFormId: selected?.bidFormId,
        itbDescription: selected?.itbDescription,
      });
    }
  }, [mode, reset, selected, selectedSuccess]);

  return (
    <Stack pos="relative">
      <LoadingOverlay visible={isLoading || isSpdLoading || isBidFormLoading} />
      <Textarea
        label="Criteria"
        withAsterisk
        autosize
        minRows={2}
        error={errors?.criteria ? errors?.criteria?.message?.toString() : ''}
        {...register('criteria')}
      />

      <TextInput
        label="ITB Reference"
        withAsterisk
        error={
          errors?.itbReference ? errors?.itbReference?.message?.toString() : ''
        }
        {...register('itbReference')}
      />

      <Textarea
        label="ITB Description"
        withAsterisk
        autosize
        minRows={2}
        error={
          errors?.itbDescription
            ? errors?.itbDescription?.message?.toString()
            : ''
        }
        {...register('itbDescription')}
      />
      <div className="flex space-x-4">
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
        <Controller
          name="requirementCondition"
          control={control}
          render={({ field: { name, value, onChange } }) => (
            <Select
              placeholder="Requirement condition"
              className="w-1/2"
              label="Requirement condition"
              value={value}
              data={Object.values(RequirementCondition)}
              onChange={(d) => onChange(d)}
              error={
                errors?.requirementCondition
                  ? errors?.requirementCondition?.message?.toString()
                  : ''
              }
            />
          )}
        />
      </div>
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
