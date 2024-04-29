import { ITenderEvaluation } from '@/models/tender/bid-procedures/evaluation.model';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  LoadingOverlay,
  MultiSelect,
  NativeSelect,
  NumberInput,
  Stack,
} from '@mantine/core';
import { logger, notify } from '@megp/core-fe';
import { EntityButton } from '@megp/entity';
import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ZodType, z } from 'zod';
import {
  useCreateMutation,
  useReadQuery,
  useUpdateMutation,
} from '@/app/(features)/preparation/_api/tender/bid-evaluations.api';
import { useParams } from 'next/navigation';

export default function BidProEvaluation() {
  const { id } = useParams();
  const EvaluationSchema: ZodType<Partial<ITenderEvaluation>> = z
    .object({
      bidEvaluationCurrency: z.array(
        z.string({
          required_error: 'Evaluation Currency is required',
        }),
      ),
      evaluationMethod: z.enum(['point system', 'compliance']),
      selectionMethod: z.enum([
        'lowest price',
        'meat',
        'lcs',
        'qcbs',
        'fbs',
        'cqs',
        'sss',
      ]),
      awardType: z.enum(['item based', 'lot based']),
      technicalWeight: z.number().optional(),
      financialWeight: z.number().optional(),
      passingMark: z.number().optional(),
    })
    .refine((data) => data.evaluationMethod === 'compliance', {
      message: 'Technical weight is required',
      path: ['technicalWeight'],
    })
    .refine((data) => data.evaluationMethod === 'compliance', {
      message: 'Financial weight is required',
      path: ['financialWeight'],
    })
    .refine((data) => data.evaluationMethod === 'compliance', {
      message: 'Passing Mark is required',
      path: ['passingMark'],
    });

  const {
    handleSubmit,
    formState: { errors },
    watch,
    reset,
    control,
    register,
  } = useForm({
    resolver: zodResolver(EvaluationSchema),
  });

  const method = watch('evaluationMethod');
  const { data: selected, isSuccess, isLoading } = useReadQuery(id?.toString());

  const [create, { isLoading: isSaving }] = useCreateMutation();
  const [update, { isLoading: isUpdating }] = useUpdateMutation();

  const onCreate = async (data) => {
    try {
      await create({
        ...data,
        tenderId: id,
      });
      notify('Success', 'Bid Procurement General created successfully');
    } catch (err) {
      notify('Error', 'Error in creating bid procurement general');
    }
  };

  const onUpdate = async (data) => {
    try {
      await update({
        ...data,
        tenderId: id,
        id: id?.toString(),
      });
      notify('Success', 'Bid Procurement General updated successfully');
    } catch {
      notify('Error', 'Error in updating bid procurement general');
    }
  };

  useEffect(() => {
    if (isSuccess && selected) {
      reset({
        bidEvaluationCurrency: selected.bidEvaluationCurrency,
        evaluationMethod: selected.evaluationMethod,
        selectionMethod: selected.selectionMethod,
        awardType: selected.awardType,
        technicalWeight: selected.technicalWeight,
        financialWeight: selected.financialWeight,
        passingMark: selected.passingMark,
      });
    }
  }, [reset, selected, isSuccess]);
  useEffect(() => {
    logger.log(errors);
  }, [errors]);
  return (
    <Stack pos="relative">
      <LoadingOverlay visible={isLoading || isUpdating || isSaving} />
      <div className="w-full flex space-x-4">
        <Controller
          name="bidEvaluationCurrency"
          control={control}
          render={({ field: { name, value, onChange } }) => (
            <MultiSelect
              placeholder="Select Bid Evaluation Currency"
              name={name}
              value={value}
              withAsterisk
              onChange={onChange}
              className="w-1/2"
              label="Bid Evaluation Currency"
              data={[
                { value: 'Not Applicable', label: 'Not Applicable' },
                { value: 'IBM', label: 'Indigenous Black Malawian' },
                { value: 'MSME', label: 'Micro, Small And Medium Enterprises' },
                { value: 'Marginalized Group', label: 'Marginalized Group' },
                { value: 'Others', label: 'Others' },
              ]}
              searchable
              clearable
              error={
                errors.bidEvaluationCurrency?.message as string | undefined
              }
            />
          )}
        />
        <NativeSelect
          placeholder="Evaluation Method"
          withAsterisk
          label="Evaluation Method"
          className="w-1/2"
          data={['point system', 'compliance']}
          error={
            errors['evaluationMethod']
              ? errors['evaluationMethod']?.message?.toString()
              : ''
          }
          {...register('evaluationMethod')}
        />
      </div>
      <div className="flex gap-3">
        <NativeSelect
          placeholder="Selection Method"
          withAsterisk
          className="w-1/2"
          label="Selection Method"
          data={['lowest price', 'meat', 'lcs', 'qcbs', 'fbs', 'cqs', 'sss']}
          error={
            errors['selectionMethod']
              ? errors['selectionMethod']?.message?.toString()
              : ''
          }
          {...register('selectionMethod')}
        />
        <NativeSelect
          placeholder="Award Type"
          withAsterisk
          className="w-1/2"
          label="Award Type"
          data={['item based', 'lot based']}
          error={
            errors['awardType'] ? errors['awardType']?.message?.toString() : ''
          }
          {...register('awardType')}
        />
      </div>
      {method !== 'compliance' && (
        <>
          <div className="flex gap-3">
            <div>
              <Controller
                name="technicalWeight"
                control={control}
                render={({ field: { name, value, onChange } }) => (
                  <NumberInput
                    label="Technical Weight"
                    name={name}
                    value={value}
                    className="w-1/2"
                    onChange={(d) => onChange(parseInt(d as string))}
                    error={
                      errors['technicalWeight']
                        ? errors['technicalWeight']?.message?.toString()
                        : ''
                    }
                    withAsterisk
                  />
                )}
              />
            </div>
            <div>
              <Controller
                name="financialWeight"
                control={control}
                render={({ field: { name, value, onChange } }) => (
                  <NumberInput
                    label="Financial Weight"
                    name={name}
                    value={value}
                    className="w-1/2"
                    onChange={(d) => onChange(parseInt(d as string))}
                    error={
                      errors['financialWeight']
                        ? errors['financialWeight']?.message?.toString()
                        : ''
                    }
                    withAsterisk
                  />
                )}
              />
            </div>
          </div>
          <div className="flex gap-3">
            <Controller
              name="passingMark"
              control={control}
              render={({ field: { name, value, onChange } }) => (
                <NumberInput
                  label="Passing Mark"
                  name={name}
                  value={value}
                  className="w-1/2"
                  onChange={(d) => onChange(parseInt(d as string))}
                  error={
                    errors['passingMark']
                      ? errors['passingMark']?.message?.toString()
                      : ''
                  }
                  withAsterisk
                />
              )}
            />
          </div>
        </>
      )}

      <EntityButton
        mode={selected ? 'detail' : 'new'}
        data={selected}
        onCreate={handleSubmit(onCreate)}
        onUpdate={handleSubmit(onUpdate)}
        onReset={reset}
        isSaving={isSaving}
        isUpdating={isUpdating}
      />
    </Stack>
  );
}
