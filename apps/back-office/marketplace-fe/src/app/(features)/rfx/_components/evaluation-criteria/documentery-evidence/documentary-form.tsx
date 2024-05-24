'use client';
import {
  useCreateMutation,
  useUpdateMutation,
} from '../../../_api/rfx/documentary-evidence.api';
import { zodResolver } from '@hookform/resolvers/zod';
import { Flex, LoadingOverlay, Stack, TextInput } from '@mantine/core';
import { logger, notify } from '@megp/core-fe';
import { EntityButton } from '@megp/entity';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const schema = z.object({
  documentTitle: z.string().min(1, { message: 'Title is required' }),
  description: z.string(),
});

type documentaryEvidenceSchema = z.infer<typeof schema>;

interface DocumentaryFormProps {
  mode: 'new' | 'detail';
  close: () => void;
  count: any;
}
export default function DocumentaryForm({
  mode,
  close,
  count,
}: DocumentaryFormProps) {
  const {
    handleSubmit,
    formState: { errors },
    register,
  } = useForm<documentaryEvidenceSchema>({
    resolver: zodResolver(schema),
  });
  const { id } = useParams();

  const [create, { isLoading }] = useCreateMutation();
  const [update, { isLoading: isUpdating }] = useUpdateMutation();

  const onCreate = async (data) => {
    await create({
      ...data,
      rfxId: id.toString(),
      order: count + 1,
    })
      .unwrap()
      .then(() => {
        close();
        notify('Success', 'Documentary Evidence created successfully');
      })
      .catch((err) => {
        notify('Error', `Error in creating Documentary Evidence Error: ${err}`);
      });
  };

  const onUpdate = async (data) => {
    try {
      await update({
        ...data,
        rfxId: id,
      });
      notify('Success', 'Qualification updated successfully');
      close();
    } catch {
      notify('Error', 'Error in updating qualification');
    }
  };

  useEffect(() => {
    logger.log(errors);
  }, [errors]);

  return (
    <Stack>
      <LoadingOverlay visible={isLoading} />
      <Flex direction={'column'} gap={'lg'}>
        <Stack>
          <TextInput
            label="Title"
            withAsterisk
            {...register('documentTitle')}
            className="w-full"
          />
          <TextInput
            label="Description"
            {...register('description')}
            className="w-full"
          />
        </Stack>
        <EntityButton
          mode={mode}
          onCreate={handleSubmit(onCreate)}
          onUpdate={handleSubmit(onUpdate)}
          isUpdating={isUpdating}
          isSaving={isLoading}
        />
      </Flex>
    </Stack>
  );
}
