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
} from '@/app/(features)/preparation/_api/lot/qualification.api';
import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { logger, notify } from '@megp/core-fe';
import { Qualification } from '@/models/tender/lot/qualification.model';
import { RequirementCondition } from '@/models/tender/lot/technical-scoring.model';
import { useLazyListByIdQuery } from '@/app/(features)/preparation/_api/lot/bid-form.api';
import { useReadQuery as useGetSpd } from '@/app/(features)/preparation/_api/tender/tender-spd.api';
interface FormDetailProps {
  mode: 'new' | 'detail';
  adId: string;
  type: string;
  lotId: string;
  returnFunction: () => void;
}

export function QualificationFormDetail({
  mode,
  adId,
  type,
  lotId,
  returnFunction,
}: FormDetailProps) {
  const { id } = useParams();
  const qualificationSchema: ZodType<Partial<Qualification>> = z.object({
    category: z.string().optional(),
    factor: z.string().min(1, { message: 'This field is required' }),
    requirement: z.string().min(1, { message: 'This field is required' }),
    bidFormId: z.string().min(1, { message: 'This field is required' }),
    itbDescription: z.string().min(1, { message: 'This field is required' }),
    itbReference: z.string().min(1, { message: 'This field is required' }),
    singleEntityCondition: z.object({
      value: z.enum(['Must meet', 'Has to meet', 'Not applicable']),
      additionalRequirements: z.string().optional(),
    }),
    jvCombinedPartnerCondition: z.object({
      value: z.enum(['Must meet', 'Has to meet', 'Not applicable']),
      additionalRequirements: z.string().optional(),
    }),
    jvEachPartnerCondition: z.object({
      value: z.enum(['Must meet', 'Has to meet', 'Not applicable']),
      additionalRequirements: z.string().optional(),
    }),
    jvAtleastOnePartnerCondition: z.object({
      value: z.enum(['Must meet', 'Has to meet', 'Not applicable']),
      additionalRequirements: z.string().optional(),
    }),
  });

  const {
    data: selectedSpd,
    isSuccess: isSpdSuccess,
    isLoading: isSpdLoading,
  } = useGetSpd(id?.toString());
  const {
    handleSubmit,
    reset,
    formState: { errors },
    control,
    register,
  } = useForm({
    resolver: zodResolver(qualificationSchema),
  });
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
    try {
      await create({
        ...data,
        lotId: lotId,
        order: 1,
        isRequired: false,
        category: type,
      });
      notify('Success', 'Qualification created successfully');
      returnFunction();
    } catch (err) {
      notify('Error', 'Error in creating qualification');
    }
  };

  const onUpdate = async (data) => {
    try {
      await update({
        ...data,
        lotId: lotId,
        category: type,
        order: 1,
        id: adId?.toString(),
      });
      notify('Success', 'Qualification updated successfully');
      returnFunction();
    } catch {
      notify('Error', 'Error in updating qualification');
    }
  };
  const onDelete = async () => {
    try {
      await remove(adId?.toString());
      notify('Success', 'Qualification  deleted successfully');
      returnFunction();
    } catch {
      notify('Error', 'Error in deleting qualification');
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
        factor: selected?.factor,
        requirement: selected?.requirement,
        attribute: selected?.attribute,
        singleEntityCondition: selected?.singleEntityCondition,
        jvCombinedPartnerCondition: selected?.jvCombinedPartnerCondition,
        jvEachPartnerCondition: selected?.jvEachPartnerCondition,
        jvAtleastOnePartnerCondition: selected?.jvAtleastOnePartnerCondition,
        bidFormId: selected?.bidFormId,
        isRequired: selected?.isRequired,
        itbDescription: selected?.itbDescription,
        itbReference: selected?.itbReference,
      });
    }
  }, [mode, reset, selected, selectedSuccess]);

  return (
    <Stack pos="relative">
      <LoadingOverlay visible={isLoading || isBidFormLoading || isSpdLoading} />
      <TextInput
        label="Factor"
        withAsterisk
        error={errors?.factor ? errors?.factor?.message?.toString() : ''}
        {...register('factor')}
      />

      <Textarea
        label="Criterion / Requirement"
        withAsterisk
        autosize
        minRows={2}
        error={
          errors?.requirement ? errors?.requirement?.message?.toString() : ''
        }
        {...register('requirement')}
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
          control={control}
          name="singleEntityCondition.value"
          render={({ field: { value, name, onChange } }) => (
            <Select
              data={Object.values(RequirementCondition)}
              label="Requirement for a Single Bidder"
              withAsterisk
              name={name}
              className="w-1/2"
              nothingFoundMessage="No options"
              onChange={onChange}
              placeholder="Requirement for a Single Bidder"
              searchable
              value={value}
            />
          )}
        />

        <Textarea
          label="Additional Requirement"
          className="w-1/2"
          autosize
          minRows={2}
          error={
            errors?.singleEntityCondition
              ? errors?.singleEntityCondition?.message?.toString()
              : ''
          }
          {...register('singleEntityCondition.additionalRequirements')}
        />
      </div>
      <div className="flex space-x-4">
        <Controller
          control={control}
          name="jvCombinedPartnerCondition.value"
          render={({ field: { value, name, onChange } }) => (
            <Select
              data={Object.values(RequirementCondition)}
              label="Jv combined condition"
              withAsterisk
              name={name}
              className="w-1/2"
              nothingFoundMessage="No options"
              onChange={onChange}
              placeholder="Jv combined condition"
              searchable
              value={value}
            />
          )}
        />

        <Textarea
          label="Additional Requirement"
          className="w-1/2"
          autosize
          minRows={2}
          error={
            errors?.jvCombinedPartnerCondition
              ? errors?.jvCombinedPartnerCondition?.message?.toString()
              : ''
          }
          {...register('jvCombinedPartnerCondition.additionalRequirements')}
        />
      </div>
      <div className="flex space-x-4">
        <Controller
          control={control}
          name="jvEachPartnerCondition.value"
          render={({ field: { value, name, onChange } }) => (
            <Select
              data={Object.values(RequirementCondition)}
              label="Jv each partner condition"
              withAsterisk
              name={name}
              className="w-1/2"
              nothingFoundMessage="No options"
              onChange={onChange}
              placeholder="Jv each partner condition"
              searchable
              value={value}
            />
          )}
        />

        <Textarea
          label="Additional Requirement"
          className="w-1/2"
          autosize
          minRows={2}
          error={
            errors?.jvEachPartnerCondition
              ? errors?.jvEachPartnerCondition?.message?.toString()
              : ''
          }
          {...register('jvEachPartnerCondition.additionalRequirements')}
        />
      </div>
      <div className="flex space-x-4">
        <Controller
          control={control}
          name="jvAtleastOnePartnerCondition.value"
          render={({ field: { value, name, onChange } }) => (
            <Select
              data={Object.values(RequirementCondition)}
              label="Jv At least One Partner Condition"
              withAsterisk
              name={name}
              className="w-1/2"
              nothingFoundMessage="No options"
              onChange={onChange}
              placeholder="Jv At least One Partner Condition"
              searchable
              value={value}
            />
          )}
        />

        <Textarea
          label="Additional Requirement"
          className="w-1/2"
          autosize
          minRows={2}
          error={
            errors?.jvAtleastOnePartnerCondition
              ? errors?.jvAtleastOnePartnerCondition?.message?.toString()
              : ''
          }
          {...register('jvAtleastOnePartnerCondition.additionalRequirements')}
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
