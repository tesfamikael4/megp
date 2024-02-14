import {
  Checkbox,
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
} from '../_api/qualification.api';
import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { logger, notify } from '@megp/core-fe';
import {
  Attributes,
  RequirementCondition,
  SpdQualification,
} from '@/models/spd/qualification.model';

interface FormDetailProps {
  mode: 'new' | 'detail';
  adId: string;
  type: 'legal' | 'professional' | 'technical' | 'financial' | 'performance';
}

export function SpdQualificationFormDetail({
  mode,
  adId,
  type,
}: FormDetailProps) {
  const spdSchema: ZodType<Partial<SpdQualification>> = z.object({
    category: z.string().optional(),
    factor: z.string().min(1, { message: 'This field is required' }),
    requirement: z.string().optional(),
    attribute: z.string().optional(),
    singleEntityCondition: z.object({
      value: z.enum(['Must meet', 'Has to meet', 'Not applicable']),
      additionalRequirements: z.string().optional(),
    }),
    jvCominedCondition: z.object({
      value: z.enum(['Must meet', 'Has to meet', 'Not applicable']),
      additionalRequirements: z.string().optional(),
    }),
    jvEachPartherCondition: z.object({
      value: z.enum(['Must meet', 'Has to meet', 'Not applicable']),
      additionalRequirements: z.string().optional(),
    }),
    jvAtleastOnePartnerCondition: z.object({
      value: z.enum(['Must meet', 'Has to meet', 'Not applicable']),
      additionalRequirements: z.string().optional(),
    }),
    formLink: z.string().min(1, { message: 'This field is required' }),
    isRequired: z.boolean(),
    itbDescription: z.string().min(1, { message: 'This field is required' }),
    reference: z.string().min(1, { message: 'This field is required' }),
    mandate: z.string().optional(),
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
  const router = useRouter();
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
        spdId: id,
        value: '',
        mandate: '',
        order: 1,
        category: type,
      });
      notify('Success', 'Qualification created successfully');
    } catch (err) {
      notify('Error', 'Error in creating spd');
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
    } catch {
      notify('Error', 'Error in updating spd');
    }
  };
  const onDelete = async () => {
    try {
      await remove(adId?.toString());
      notify('Success', 'Qualification  deleted successfully');
      router.push('/spds');
    } catch {
      notify('Error', 'Error in deleting spd');
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
        jvCominedCondition: selected?.jvCominedCondition,
        jvEachPartherCondition: selected?.jvEachPartherCondition,
        jvAtleastOnePartnerCondition: selected?.jvAtleastOnePartnerCondition,
        formLink: selected?.formLink,
        isRequired: selected?.isRequired,
        itbDescription: selected?.itbDescription,
        reference: selected?.reference,
        mandate: selected?.itbDescription,
      });
    }
  }, [mode, reset, selected, selectedSuccess]);

  return (
    <Stack pos="relative">
      <LoadingOverlay visible={isLoading} />
      <Checkbox
        label="The Criterion to be created shall not be modified by a Procuring Entity"
        {...register('isRequired')}
      />
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
      <NativeSelect
        placeholder="Data Field from ITB"
        withAsterisk
        label="Data Field from ITB"
        data={Attributes[type]}
        {...register('attribute')}
      />

      <TextInput
        label="ITB Reference"
        withAsterisk
        error={errors?.reference ? errors?.reference?.message?.toString() : ''}
        {...register('reference')}
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
          withAsterisk
          autosize
          minRows={2}
          className="w-1/2"
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
          {...register('jvCominedCondition.value')}
        />

        <Textarea
          label="Additional Requirement"
          withAsterisk
          autosize
          minRows={2}
          className="w-1/2"
          error={
            errors?.jvCominedCondition
              ? errors?.jvCominedCondition?.message?.toString()
              : ''
          }
          {...register('jvCominedCondition.additionalRequirements')}
        />
      </div>
      <div className="flex space-x-4">
        <NativeSelect
          placeholder="Jv each partner condition"
          withAsterisk
          className="w-1/2"
          label="Jv each partner condition"
          data={Object.values(RequirementCondition)}
          {...register('jvEachPartherCondition.value')}
        />

        <Textarea
          label="Additional Requirement"
          withAsterisk
          autosize
          className="w-1/2"
          minRows={2}
          error={
            errors?.jvEachPartherCondition
              ? errors?.jvEachPartherCondition?.message?.toString()
              : ''
          }
          {...register('jvEachPartherCondition.additionalRequirements')}
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
          withAsterisk
          autosize
          className="w-1/2"
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
