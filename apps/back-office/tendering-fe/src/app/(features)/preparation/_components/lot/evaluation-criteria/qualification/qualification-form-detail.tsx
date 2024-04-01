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
} from '@/app/(features)/preparation/_api/lot/qualification.api';
import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { logger, notify } from '@megp/core-fe';
import { Qualification } from '@/models/tender/lot/qualification.model';
import { RequirementCondition } from '@/models/tender/lot/technical-scoring.model';

interface FormDetailProps {
  mode: 'new' | 'detail';
  adId: string;
  type: 'legal' | 'professional' | 'technical' | 'financial' | 'performance';
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
  const qualificationSchema: ZodType<Partial<Qualification>> = z.object({
    category: z.string().optional(),
    factor: z.string().min(1, { message: 'This field is required' }),
    requirement: z.string().min(1, { message: 'This field is required' }),
    formLink: z.string().min(1, { message: 'This field is required' }),
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
    handleSubmit,
    reset,
    formState: { errors },
    register,
  } = useForm({
    resolver: zodResolver(qualificationSchema),
  });
  useEffect(() => {
    logger.log(errors);
  }, [errors]);
  const { id } = useParams();

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
        pdId: id,
        value: '',
        category: type,
        order: 1,
        mandate: '',
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
        formLink: selected?.formLink,
        isRequired: selected?.isRequired,
        itbDescription: selected?.itbDescription,
        itbReference: selected?.itbReference,
      });
    }
  }, [mode, reset, selected, selectedSuccess]);

  return (
    <Stack pos="relative">
      <LoadingOverlay visible={isLoading} />
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
        <NativeSelect
          placeholder="Requirement for a Single Bidder"
          withAsterisk
          className="w-1/2"
          label="Requirement for a Single Bidder"
          data={Object.values(RequirementCondition)}
          {...register('singleEntityCondition.value')}
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
        <NativeSelect
          placeholder="Jv combined condition"
          withAsterisk
          className="w-1/2"
          label="Jv combined condition"
          data={Object.values(RequirementCondition)}
          {...register('jvCombinedPartnerCondition.value')}
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
        <NativeSelect
          placeholder="Jv each partner condition"
          withAsterisk
          className="w-1/2"
          label="Jv each partner condition"
          data={Object.values(RequirementCondition)}
          {...register('jvEachPartnerCondition.value')}
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
        <NativeSelect
          placeholder="Jv at least one partner condition"
          withAsterisk
          className="w-1/2"
          label="Jv At least One Partner Condition"
          data={Object.values(RequirementCondition)}
          {...register('jvAtleastOnePartnerCondition.value')}
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
