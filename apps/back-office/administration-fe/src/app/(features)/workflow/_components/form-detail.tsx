import { useAddActivityMutation } from '@/store/api/workflow/workflow.api';
import { zodResolver } from '@hookform/resolvers/zod';
import { TextInput, Button, Stack } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { logger } from '@megp/core-fe';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';

const schema = z.object({
  title: z.string(),
  description: z.string(),
});

type formSchema = z.infer<typeof schema>;

export default function FormDetail({ mode }: { mode: 'update' | 'new' }) {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<formSchema>({
    resolver: zodResolver(schema),
  });
  const [addActivity, { isLoading: isSaving }] = useAddActivityMutation();
  const router = useRouter();

  const onSubmit = async (data) => {
    try {
      await addActivity(data).unwrap();
      notifications.show({
        title: 'Success',
        message: 'Activity created',
        color: 'green',
      });
      router.push(`/workflow`);
    } catch (err) {
      notifications.show({
        title: 'Error',
        message: 'Something went wrong',
        color: 'red',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack>
        <TextInput
          label="Title"
          {...register('title')}
          error={errors?.title?.message}
        />
        <TextInput
          label="Description"
          {...register('description')}
          error={errors?.description?.message}
        />
        <Button type="submit" className="ml-auto" loading={isSaving}>
          Save
        </Button>
      </Stack>
    </form>
  );
}
