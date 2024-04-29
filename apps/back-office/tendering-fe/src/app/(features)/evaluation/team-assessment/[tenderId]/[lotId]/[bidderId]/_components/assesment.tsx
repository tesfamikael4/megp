'use client';
import { useCheckBidAttributeMutation } from '@/store/api/tendering/preliminary-compliance.api';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Group, Select, Textarea } from '@mantine/core';
import { Section, notify } from '@megp/core-fe';
import { useParams, useSearchParams } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import { ZodType, z } from 'zod';

const checklistSchema: ZodType<any> = z.object({
  checked: z.boolean({
    required_error: 'Assessment is required',
  }),
  remark: z.string().optional(),
});

export const ChecklistAssessment = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<any>({ resolver: zodResolver(checklistSchema) });
  const { lotId, bidderId, tenderId } = useParams();
  const searchParams = useSearchParams();
  const [checkBidAttribute, { isLoading }] = useCheckBidAttributeMutation();

  const onSubmit = async (data: any) => {
    const tempData = {
      ...data,
      spdPreliminaryEvaluationId: searchParams.get('checklistId'),
      lotId,
      bidderId,
      tenderId,
      isTeamAssessment: true,
    };
    try {
      await checkBidAttribute(tempData).unwrap();
      notify('Success', 'Assessment saved successfully');
    } catch (err) {
      notify('Error', 'Something went wrong');
    }
  };
  return (
    <Section title="Bidder Checklist" collapsible={false} className="h-full">
      <Controller
        control={control}
        name="checked"
        render={({ field: { name, value, onChange } }) => (
          <Select
            label="Assessment"
            name={name}
            value={value?.toString()}
            data={[
              { label: 'Yes', value: 'true' },
              { label: 'No', value: 'false' },
            ]}
            withAsterisk
            onChange={(val) => {
              if (val === 'true') onChange(true);
              else if (val === 'false') onChange(false);
            }}
            error={errors.checked?.message?.toString()}
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
    </Section>
  );
};
