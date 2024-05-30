'use client';

import {
  useCreateTechnicalScoringComplianceAssessmentMutation,
  useGetEqcTechnicalScoringQuery,
  useLazyGetEqcTechnicalScoringQuery,
} from '@/store/api/tendering/technical-scoring.api';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
  Group,
  LoadingOverlay,
  NumberInput,
  Stack,
  TextInput,
  Textarea,
} from '@mantine/core';
import { logger, notify } from '@megp/core-fe';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ZodType, z } from 'zod';

const checklistSchema: ZodType<any> = z.object({
  pointsAwarded: z.number({
    required_error: 'Awarded Point is required',
  }),
  remark: z.string().optional(),
});

export const ScoringCompliance = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
    control,
  } = useForm<any>({ resolver: zodResolver(checklistSchema) });
  const [createTechnicalScoringCompliance, { isLoading }] =
    useCreateTechnicalScoringComplianceAssessmentMutation();
  const { lotId, bidderId, requirementId } = useParams();
  const [getEqc, { data: eqcTechnicalScoring, isFetching }] =
    useLazyGetEqcTechnicalScoringQuery();

  const onSubmit = async (data) => {
    try {
      await createTechnicalScoringCompliance({
        ...data,
        lotId,
        bidderId,
        eqcTechnicalScoringId: requirementId,
      }).unwrap();
      notify('Success', 'Created successfully');
    } catch (err) {
      if (err.status == 430) {
        notify('Error', err.data.message);
      } else notify('Error', 'Something went wrong');
    }
  };

  useEffect(() => {
    getEqc(requirementId);
  }, [getEqc, requirementId]);
  return (
    <Stack pos="relative">
      <LoadingOverlay visible={isFetching} />
      <Controller
        control={control}
        name="pointsAwarded"
        render={({ field: { name, value, onChange } }) => (
          <NumberInput
            min={0}
            max={eqcTechnicalScoring?.point ?? 0}
            // type="num"
            label={`Points Awarded (Max ${eqcTechnicalScoring?.point ?? 0})`}
            name={name}
            value={value}
            onChange={(e) => onChange(parseInt(e.toString()))}
            error={errors?.pointsAwarded?.message?.toString()}
          />
        )}
      />

      <Textarea
        autosize
        label="Remark"
        mt={10}
        minRows={7}
        {...register('remark')}
      />
      <Group justify="end" mt={10}>
        <Button onClick={handleSubmit(onSubmit)} loading={isLoading}>
          Save
        </Button>
      </Group>
    </Stack>
  );
};
