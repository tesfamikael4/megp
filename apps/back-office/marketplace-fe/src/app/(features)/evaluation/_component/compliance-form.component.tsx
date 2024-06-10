import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Select, Stack, Textarea } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { Section } from '@megp/core-fe';
import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  useCreateMutation,
  useLazyReadQuery,
  useUpdateMutation,
} from '../_api/eval-response.api';
import { useParams } from 'next/navigation';
import {
  useCreateEvalMutation,
  useLazyGetMyResponseQuery,
  useUpdateEvalMutation,
} from '@/store/api/rfx/rfx.api';

const schema = z.object({
  qualified: z.string(),
  remark: z.string().optional(),
});

type FormSchema = z.infer<typeof schema>;

export default function Compliance() {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormSchema>({
    resolver: zodResolver(schema),
  });
  const { id, bidderId, requirmentId, assessmentMode } = useParams();

  const [saveResponse, { isLoading: isSaving }] = useCreateEvalMutation();
  const [getMyResponse, { data: myResponse }] = useLazyGetMyResponseQuery();

  const onSubmit = async (data: FormSchema) => {
    try {
      bidderId &&
        (await saveResponse({
          rfxId: id?.toString(),
          solRegistrationId: bidderId?.toString(),
          rfxDocumentaryEvidenceId: requirmentId?.toString(),
          isTeamAssessment: assessmentMode == 'team' ? true : false,
          ...data,
        }));
    } catch {
      notifications.show({
        title: 'Failed to save compliance',
        message: 'Please try again',
        color: 'red',
      });
    }
  };

  useEffect(() => {
    getMyResponse({
      rfxId: id.toString(),
      rfxDocumentaryEvidenceId: requirmentId.toString(),
      isTeamAssessment: assessmentMode == 'team' ? true : false,
    });
  }, [requirmentId, id]);

  useEffect(() => {
    if (myResponse) {
      reset(myResponse);
    }
  }, [myResponse]);

  return (
    <Section title="Compliance" collapsible={false}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack>
          <Controller
            name="qualified"
            control={control}
            render={({ field: { value, onChange } }) => (
              <Select
                label="Assessment"
                withAsterisk
                value={value}
                onChange={onChange}
                data={[
                  { label: 'Comply', value: 'COMPLY' },
                  { label: 'Not Comply', value: 'NOT_COMPLY' },
                ]}
                error={errors?.qualified?.message}
              />
            )}
          />
          <Textarea
            label="Remark"
            {...register('remark')}
            minRows={5}
            autosize
          />
          <Button className="ml-auto" type="submit" loading={isSaving}>
            Save
          </Button>
        </Stack>
      </form>
    </Section>
  );
}
