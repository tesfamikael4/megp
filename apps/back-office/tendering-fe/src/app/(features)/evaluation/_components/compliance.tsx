'use client';
import { useCreatePreliminaryComplianceAssessmentMutation } from '@/store/api/tendering/preliminary-compliance.api';
import { useCreateTechnicalQualificationAssessmentMutation } from '@/store/api/tendering/technical-qualification';
import { useCreateTechnicalResponsivenessAssessmentMutation } from '@/store/api/tendering/technical-responsiveness.api';
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

export const ComplianceAssessment = ({
  milestone,
  teamAssessment = false,
}: {
  milestone:
    | 'technicalCompliance'
    | 'technicalQualification'
    | 'technicalResponsiveness';
  teamAssessment?: boolean;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<any>({ resolver: zodResolver(checklistSchema) });
  const { lotId, bidderId, tenderId, requirementId, itemId } = useParams();
  const [createPreliminaryCompliance, { isLoading }] =
    useCreatePreliminaryComplianceAssessmentMutation();
  const [
    createTechnicalQualificationAssessment,
    { isLoading: isQualificationAssessmentCreating },
  ] = useCreateTechnicalQualificationAssessmentMutation();
  const [
    createTechnicalResponsivenessAssessment,
    { isLoading: isResponsivenessAssessmentCreating },
  ] = useCreateTechnicalResponsivenessAssessmentMutation();

  const onSubmit = async (data: any) => {
    try {
      if (milestone === 'technicalCompliance') {
        const castedData = {
          ...data,
          eqcPreliminaryExaminationId: requirementId,
          lotId,
          bidderId,
          tenderId,
          isTeamAssessment: teamAssessment,
        };
        await createPreliminaryCompliance(castedData).unwrap();
      } else if (milestone === 'technicalQualification') {
        const castedData = {
          ...data,
          eqcQualificationId: requirementId,
          lotId,
          bidderId,
          tenderId,
          isTeamAssessment: teamAssessment,
        };
        await createTechnicalQualificationAssessment(castedData).unwrap();
      } else if (milestone === 'technicalResponsiveness') {
        const castedData = {
          ...data,
          sorTechnicalRequirementId: requirementId,
          lotId,
          bidderId,
          tenderId,
          itemId,
        };
        await createTechnicalResponsivenessAssessment(castedData).unwrap();
      }
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
            ]}
            withAsterisk
            onChange={onChange}
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
        <Button
          onClick={handleSubmit(onSubmit)}
          loading={
            isLoading ||
            isQualificationAssessmentCreating ||
            isResponsivenessAssessmentCreating
          }
        >
          Save
        </Button>
      </Group>
    </Section>
  );
};
