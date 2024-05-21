'use client';
import { useCheckBidAttributeMutation } from '@/store/api/tendering/technical-qualification';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Group, Select, Textarea } from '@mantine/core';
import { Section, notify } from '@megp/core-fe';
import { useParams } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import { ZodType, z } from 'zod';

const checklistSchema: ZodType<any> = z.object({
  qualified: z.string({
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
  const { lotId, bidderId, tenderId, checklistId } = useParams();
  const [checkBidAttribute, { isLoading }] = useCheckBidAttributeMutation();

  const onSubmit = async (data: any) => {
    const tempData = {
      ...data,
      eqcQualificationId: checklistId,
      lotId,
      bidderId,
      tenderId,
    };
    try {
      await checkBidAttribute(tempData).unwrap();
      notify('Success', 'Assessment saved successfully');
    } catch (err) {
      notify('Error', 'Something went wrong');
    }
  };
  return (
    <Section title="Compliance" collapsible={false} className="h-full">
      <Controller
        control={control}
        name="qualified"
        render={({ field: { name, value, onChange } }) => (
          <Select
            label="Assessment"
            name={name}
            value={value?.toString()}
            data={[
              { label: 'Comply', value: 'COMPLY' },
              { label: 'Not Comply', value: 'NOT_COMPLY' },
              { label: 'In Progress', value: 'IN_PROGRESS' },
              { label: 'Not Done', value: 'NOT_DONE' },
              { label: 'Not Applicable', value: 'NOT_APPLICABLE' },
            ]}
            withAsterisk
            onChange={onChange}
            // onChange={(val) => {
            //   if (val === 'true') onChange(true);
            //   else if (val === 'false') onChange(false);
            // }}
            error={errors.qualified?.message?.toString()}
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
